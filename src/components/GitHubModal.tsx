import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Github, 
  Star, 
  GitFork, 
  Download, 
  Upload, 
  Plus,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  Calendar
} from 'lucide-react'
import { githubService, type GitHubRepo, type GitHubUser } from '../utils/githubService'
import { useAppStore } from '../store'

interface GitHubModalProps {
  isOpen: boolean
  onClose: () => void
}

const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repositories, setRepositories] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Export form state
  const [repoName, setRepoName] = useState('')
  const [repoDescription, setRepoDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [commitMessage, setCommitMessage] = useState('Initial commit from NeonForge')

  const { 
    files, 
    setFiles, 
    addTerminalOutput, 
    addChatMessage 
  } = useAppStore()

  useEffect(() => {
    if (isOpen) {
      checkAuthentication()
    }
  }, [isOpen])

  const checkAuthentication = async () => {
    setLoading(true)
    try {
      const authenticated = await githubService.initialize()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        const userData = await githubService.getCurrentUser()
        setUser(userData)
        
        if (userData) {
          const repos = await githubService.getUserRepositories()
          setRepositories(repos)
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const result = await githubService.signInWithGitHub()
      if (result.success) {
        addChatMessage('assistant', '✅ Successfully connected to GitHub! You can now import and export repositories.')
        await checkAuthentication()
      } else {
        addChatMessage('assistant', '❌ Failed to connect to GitHub. Please try again.')
      }
    } catch (error) {
      console.error('Sign-in failed:', error)
      addChatMessage('assistant', '❌ GitHub authentication failed. Please check your configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await githubService.signOut()
      setIsAuthenticated(false)
      setUser(null)
      setRepositories([])
      addChatMessage('assistant', '👋 Disconnected from GitHub.')
    } catch (error) {
      console.error('Sign-out failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImportRepo = async (repo: GitHubRepo) => {
    setLoading(true)
    addTerminalOutput(`📥 Importing repository: ${repo.full_name}...`)
    
    try {
      const [owner, repoName] = repo.full_name.split('/')
      const result = await githubService.importFromRepository(owner, repoName)
      
      if (result) {
        setFiles(result.files)
        addTerminalOutput(`✅ Successfully imported ${repo.full_name}`)
        addChatMessage('assistant', `🎉 Repository "${repo.name}" has been imported! You can now edit the files and use AI to enhance the project.`)
        onClose()
      } else {
        addTerminalOutput(`❌ Failed to import ${repo.full_name}`)
        addChatMessage('assistant', `❌ Failed to import repository "${repo.name}". Please try again.`)
      }
    } catch (error) {
      console.error('Import failed:', error)
      addTerminalOutput(`❌ Import error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleExportRepo = async () => {
    if (!repoName.trim()) return
    
    setLoading(true)
    addTerminalOutput(`📤 Creating repository: ${repoName}...`)
    
    try {
      // Create repository
      const createResult = await githubService.createRepository(
        repoName,
        repoDescription || 'Created with NeonForge',
        isPrivate
      )
      
      if (!createResult.success) {
        throw createResult.error
      }
      
      addTerminalOutput(`✅ Repository created: ${createResult.repo!.full_name}`)
      
      // Push files
      addTerminalOutput('📤 Pushing files to repository...')
      const pushResult = await githubService.pushProjectToRepo(
        repoName,
        files,
        commitMessage
      )
      
      if (pushResult.success) {
        addTerminalOutput(`✅ Successfully pushed to ${createResult.repo!.html_url}`)
        addChatMessage('assistant', `🚀 Your project has been exported to GitHub! Visit: ${createResult.repo!.html_url}`)
        onClose()
      } else {
        throw pushResult.error
      }
    } catch (error) {
      console.error('Export failed:', error)
      addTerminalOutput(`❌ Export error: ${error}`)
      addChatMessage('assistant', `❌ Failed to export to GitHub: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hasProject = Object.keys(files).length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-cyber-dark border border-neon-green/30 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neon-green/20">
              <div className="flex items-center space-x-3">
                <Github className="w-6 h-6 text-neon-green animate-pulse-neon" />
                <h2 className="text-2xl font-cyber font-bold text-white">GitHub Integration</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyber-light/50 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {!isAuthenticated ? (
              <div className="p-8 text-center">
                <Github className="w-16 h-16 text-neon-green mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">Connect to GitHub</h3>
                <p className="text-gray-400 mb-6">
                  Sign in with GitHub to import repositories and export your projects
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                  disabled={loading}
                  className="btn-neon border-neon-green text-neon-green hover:bg-neon-green px-6 py-3 disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full inline-block mr-2"
                    />
                  ) : (
                    <Github className="w-5 h-5 inline mr-2" />
                  )}
                  Sign in with GitHub
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col h-[calc(90vh-140px)]">
                {/* User Info & Tabs */}
                <div className="p-6 border-b border-neon-green/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {user?.avatar_url && (
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-10 h-10 rounded-full border-2 border-neon-green/50"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-white">{user?.name || user?.login}</h3>
                        <p className="text-sm text-gray-400">@{user?.login}</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignOut}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Sign Out
                    </motion.button>
                  </div>
                  
                  <div className="flex space-x-1 bg-cyber-gray/30 p-1 rounded-lg">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('import')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'import'
                          ? 'bg-neon-green text-cyber-dark'
                          : 'text-gray-300 hover:text-white hover:bg-cyber-light/50'
                      }`}
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Import Repository
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('export')}
                      disabled={!hasProject}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeTab === 'export'
                          ? 'bg-neon-green text-cyber-dark'
                          : 'text-gray-300 hover:text-white hover:bg-cyber-light/50'
                      }`}
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      Export Project
                    </motion.button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'import' ? (
                    <div className="h-full flex flex-col">
                      {/* Search */}
                      <div className="p-4 border-b border-neon-green/20">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search repositories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-cyber-gray/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50"
                          />
                        </div>
                      </div>
                      
                      {/* Repository List */}
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid gap-3">
                          {filteredRepos.map((repo) => (
                            <motion.div
                              key={repo.id}
                              whileHover={{ y: -2, scale: 1.01 }}
                              className="bg-cyber-gray/30 p-4 rounded-lg border border-neon-green/20 hover:border-neon-green/50 transition-all cursor-pointer group"
                              onClick={() => handleImportRepo(repo)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold text-white group-hover:text-neon-green transition-colors">
                                      {repo.name}
                                    </h4>
                                    {repo.private ? (
                                      <Lock className="w-4 h-4 text-yellow-400" />
                                    ) : (
                                      <Unlock className="w-4 h-4 text-green-400" />
                                    )}
                                  </div>
                                  
                                  {repo.description && (
                                    <p className="text-sm text-gray-400 mb-3">{repo.description}</p>
                                  )}
                                  
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {repo.language && (
                                      <span className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full" />
                                        <span>{repo.language}</span>
                                      </span>
                                    )}
                                    <span className="flex items-center space-x-1">
                                      <Star className="w-3 h-3" />
                                      <span>{repo.stargazers_count}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <GitFork className="w-3 h-3" />
                                      <span>{repo.forks_count}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                                    </span>
                                  </div>
                                </div>
                                
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-neon-green transition-colors" />
                              </div>
                            </motion.div>
                          ))}
                          
                          {filteredRepos.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-400">
                              <Github className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>No repositories found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      {hasProject ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-neon-green mb-4">Export Current Project</h3>
                            <p className="text-gray-400 mb-6">
                              Create a new GitHub repository and push your current project files.
                            </p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Repository Name *
                                </label>
                                <input
                                  type="text"
                                  value={repoName}
                                  onChange={(e) => setRepoName(e.target.value)}
                                  placeholder="my-awesome-project"
                                  className="w-full px-3 py-2 bg-cyber-gray/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Description
                                </label>
                                <textarea
                                  value={repoDescription}
                                  onChange={(e) => setRepoDescription(e.target.value)}
                                  placeholder="A brief description of your project"
                                  rows={3}
                                  className="w-full px-3 py-2 bg-cyber-gray/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50 resize-none"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Commit Message
                                </label>
                                <input
                                  type="text"
                                  value={commitMessage}
                                  onChange={(e) => setCommitMessage(e.target.value)}
                                  className="w-full px-3 py-2 bg-cyber-gray/50 border border-neon-green/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/50"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className="w-4 h-4 text-neon-green bg-cyber-gray border-neon-green/30 rounded focus:ring-neon-green/50"
                                  />
                                  <span className="text-sm text-gray-300">
                                    Make repository private
                                  </span>
                                </label>
                              </div>
                              
                              <div className="bg-cyber-gray/30 p-4 rounded-lg border border-neon-green/20">
                                <h4 className="text-sm font-medium text-neon-green mb-2">Project Files</h4>
                                <div className="text-xs text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                                  {Object.keys(files).map((filename, index) => (
                                    <div key={index}>📄 {filename}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleExportRepo}
                            disabled={!repoName.trim() || loading}
                            className="w-full btn-neon border-neon-green text-neon-green hover:bg-neon-green py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full inline-block mr-2"
                              />
                            ) : (
                              <Upload className="w-5 h-5 inline mr-2" />
                            )}
                            Export to GitHub
                          </motion.button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Project to Export</h3>
                          <p className="text-gray-400 mb-4">
                            Create a new project or import one from GitHub first.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('import')}
                            className="btn-neon border-neon-cyan text-neon-cyan hover:bg-neon-cyan text-sm px-4 py-2"
                          >
                            Import Repository
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GitHubModal
