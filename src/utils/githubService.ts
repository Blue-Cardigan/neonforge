import { Octokit } from '@octokit/rest'
import { supabase } from './supabase'
import { decodeBase64ToUTF8, encodeUTF8ToBase64 } from './browserPolyfills'
import type { FileSystemNode } from '../store'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  html_url: string
  clone_url: string
  updated_at: string
  language: string | null
  stargazers_count: number
  forks_count: number
}

export interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  name: string | null
  email: string | null
  public_repos: number
  followers: number
  following: number
}

class GitHubService {
  private octokit: Octokit | null = null
  private accessToken: string | null = null

  async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.provider_token) {
        this.accessToken = session.provider_token
        this.octokit = new Octokit({
          auth: this.accessToken,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to initialize GitHub service:', error)
      return false
    }
  }

  async signInWithGitHub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'repo user',
          redirectTo: window.location.origin
        }
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('GitHub sign-in error:', error)
      return { success: false, error: error as Error }
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      this.octokit = null
      this.accessToken = null
      return { success: true }
    } catch (error) {
      console.error('GitHub sign-out error:', error)
      return { success: false, error: error as Error }
    }
  }

  async getCurrentUser(): Promise<GitHubUser | null> {
    if (!this.octokit) {
      await this.initialize()
    }

    if (!this.octokit) return null

    try {
      const { data } = await this.octokit.users.getAuthenticated()
      return data as GitHubUser
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  async getUserRepositories(username?: string): Promise<GitHubRepo[]> {
    if (!this.octokit) {
      await this.initialize()
    }

    if (!this.octokit) return []

    try {
      const { data } = username 
        ? await this.octokit.repos.listForUser({ username, sort: 'updated', per_page: 100 })
        : await this.octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 100 })
      
      return data as GitHubRepo[]
    } catch (error) {
      console.error('Failed to get repositories:', error)
      return []
    }
  }

  async createRepository(name: string, description: string, isPrivate: boolean = false) {
    if (!this.octokit) {
      await this.initialize()
    }

    if (!this.octokit) throw new Error('GitHub not authenticated')

    try {
      const { data } = await this.octokit.repos.create({
        name,
        description,
        private: isPrivate,
        auto_init: true
      })

      return { success: true, repo: data as GitHubRepo }
    } catch (error) {
      console.error('Failed to create repository:', error)
      return { success: false, error: error as Error }
    }
  }

  async pushProjectToRepo(
    repoName: string, 
    files: FileSystemNode, 
    commitMessage: string = 'Initial commit from NeonForge'
  ) {
    if (!this.octokit) {
      await this.initialize()
    }

    if (!this.octokit) throw new Error('GitHub not authenticated')

    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('Could not get user information')

      // Get the repository
      const { data: repo } = await this.octokit.repos.get({
        owner: user.login,
        repo: repoName
      })

      // Get the default branch reference
      const { data: ref } = await this.octokit.git.getRef({
        owner: user.login,
        repo: repoName,
        ref: `heads/${repo.default_branch}`
      })

      // Get the commit that the reference points to
      const { data: commit } = await this.octokit.git.getCommit({
        owner: user.login,
        repo: repoName,
        commit_sha: ref.object.sha
      })

      // Create blobs for all files
      const fileBlobs: Array<{ path: string; sha: string; mode: '100644' }> = []
      
      const createBlobs = async (nodes: FileSystemNode, basePath = '') => {
        for (const [name, node] of Object.entries(nodes)) {
          const path = basePath ? `${basePath}/${name}` : name
          
          if (node.file) {
            // Use our browser-compatible encoding
            const contentBase64 = encodeUTF8ToBase64(node.file.contents)
            
            const { data: blob } = await this.octokit!.git.createBlob({
              owner: user.login,
              repo: repoName,
              content: contentBase64,
              encoding: 'base64'
            })
            
            fileBlobs.push({
              path,
              sha: blob.sha,
              mode: '100644'
            })
          } else if (node.directory) {
            await createBlobs(node.directory, path)
          }
        }
      }

      await createBlobs(files)

      // Create a new tree
      const { data: tree } = await this.octokit.git.createTree({
        owner: user.login,
        repo: repoName,
        tree: fileBlobs,
        base_tree: commit.tree.sha
      })

      // Create a new commit
      const { data: newCommit } = await this.octokit.git.createCommit({
        owner: user.login,
        repo: repoName,
        message: commitMessage,
        tree: tree.sha,
        parents: [commit.sha]
      })

      // Update the reference
      await this.octokit.git.updateRef({
        owner: user.login,
        repo: repoName,
        ref: `heads/${repo.default_branch}`,
        sha: newCommit.sha
      })

      return { 
        success: true, 
        commitSha: newCommit.sha,
        repoUrl: repo.html_url
      }
    } catch (error) {
      console.error('Failed to push to repository:', error)
      return { success: false, error: error as Error }
    }
  }

  async importFromRepository(owner: string, repo: string): Promise<{ files: FileSystemNode } | null> {
    if (!this.octokit) {
      await this.initialize()
    }

    if (!this.octokit) return null

    try {
      // Get repository contents
      const { data: contents } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: ''
      })

      if (!Array.isArray(contents)) return null

      const files: FileSystemNode = {}

      const fetchFileContents = async (items: any[], basePath = ''): Promise<void> => {
        for (const item of items) {
          const path = basePath ? `${basePath}/${item.name}` : item.name
          
          if (item.type === 'file') {
            try {
              const { data: fileData } = await this.octokit!.repos.getContent({
                owner,
                repo,
                path: item.path
              })

              if ('content' in fileData && fileData.content) {
                // Use our browser-compatible decoding
                const content = decodeBase64ToUTF8(fileData.content)
                
                // Navigate to the correct location in the files object
                const pathParts = path.split('/')
                let current = files
                
                for (let i = 0; i < pathParts.length - 1; i++) {
                  const part = pathParts[i]
                  if (!current[part]) {
                    current[part] = { directory: {} }
                  }
                  current = current[part].directory!
                }
                
                const fileName = pathParts[pathParts.length - 1]
                current[fileName] = { file: { contents: content } }
              }
            } catch (error) {
              console.warn(`Failed to fetch file ${item.path}:`, error)
            }
          } else if (item.type === 'dir') {
            try {
              const { data: dirContents } = await this.octokit!.repos.getContent({
                owner,
                repo,
                path: item.path
              })

              if (Array.isArray(dirContents)) {
                await fetchFileContents(dirContents, path)
              }
            } catch (error) {
              console.warn(`Failed to fetch directory ${item.path}:`, error)
            }
          }
        }
      }

      await fetchFileContents(contents)
      return { files }
    } catch (error) {
      console.error('Failed to import repository:', error)
      return null
    }
  }

  isAuthenticated(): boolean {
    return this.octokit !== null
  }
}

export const githubService = new GitHubService()
export default githubService
