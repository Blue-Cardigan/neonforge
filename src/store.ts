import { create } from 'zustand'
import type { WebContainer } from '@webcontainer/api'
import { geminiService, type GeneratedCode } from './utils/geminiService'
import type { ProjectTemplate } from './templates/projectTemplates'

export interface FileSystemNode {
  [key: string]: {
    file?: {
      contents: string
    }
    directory?: FileSystemNode
  }
}

interface AppState {
  // WebContainer state
  webcontainer: WebContainer | null
  isContainerReady: boolean
  serverUrl: string | null
  
  // Project state
  files: FileSystemNode
  activeFile: string | null
  
  // UI state
  isGenerating: boolean
  prompt: string
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  showNewProjectModal: boolean
  showGitHubModal: boolean
  
  // Terminal state
  terminalOutput: string[]
  
  // Actions
  setWebContainer: (container: WebContainer) => void
  setContainerReady: (ready: boolean) => void
  setServerUrl: (url: string | null) => void
  setFiles: (files: FileSystemNode) => void
  setActiveFile: (file: string | null) => void
  updateFileContent: (path: string, content: string) => void
  setPrompt: (prompt: string) => void
  setIsGenerating: (generating: boolean) => void
  addChatMessage: (role: 'user' | 'assistant', content: string) => void
  addTerminalOutput: (output: string) => void
  clearTerminal: () => void
  generateCodeWithAI: (prompt: string) => Promise<void>
  installDependencies: (dependencies: string[]) => Promise<void>
  createNewProject: (template: ProjectTemplate, projectName: string) => Promise<void>
  setShowNewProjectModal: (show: boolean) => void
  setShowGitHubModal: (show: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  webcontainer: null,
  isContainerReady: false,
  serverUrl: null,
  files: {},
  activeFile: null,
  isGenerating: false,
  prompt: '',
  chatHistory: [],
  terminalOutput: [],
  showNewProjectModal: false,
  showGitHubModal: false,
  
  // Actions
  setWebContainer: (container) => set({ webcontainer: container }),
  setContainerReady: (ready) => set({ isContainerReady: ready }),
  setServerUrl: (url) => set({ serverUrl: url }),
  setFiles: (files) => set({ files }),
  setActiveFile: (file) => set({ activeFile: file }),
  
  updateFileContent: (path, content) => {
    const { files } = get()
    const pathParts = path.split('/')
    const newFiles = { ...files }
    
    let current = newFiles
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i]
      if (!current[part]) {
        current[part] = { directory: {} }
      }
      current = current[part].directory!
    }
    
    const fileName = pathParts[pathParts.length - 1]
    current[fileName] = {
      file: { contents: content }
    }
    
    set({ files: newFiles })
  },
  
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  addChatMessage: (role, content) => {
    const { chatHistory } = get()
    set({ chatHistory: [...chatHistory, { role, content }] })
  },
  
  addTerminalOutput: (output) => {
    const { terminalOutput } = get()
    set({ terminalOutput: [...terminalOutput, output] })
  },
  
  clearTerminal: () => set({ terminalOutput: [] }),
  
  generateCodeWithAI: async (prompt: string) => {
    const { webcontainer, files, addChatMessage, addTerminalOutput, setIsGenerating } = get()
    
    try {
      setIsGenerating(true)
      addChatMessage('user', prompt)
      addTerminalOutput(`🤖 AI: Generating code for "${prompt}"...`)
      
      // Get current files context for better AI understanding
      const currentFiles: Record<string, string> = {}
      const extractFiles = (nodes: FileSystemNode, basePath = '') => {
        Object.entries(nodes).forEach(([name, node]) => {
          const path = basePath ? `${basePath}/${name}` : name
          if (node.file) {
            currentFiles[path] = node.file.contents
          } else if (node.directory) {
            extractFiles(node.directory, path)
          }
        })
      }
      extractFiles(files)
      
      const result: GeneratedCode = await geminiService.generateCode({
        prompt,
        currentFiles
      })
      
      addChatMessage('assistant', result.explanation)
      
      // Create/update files
      if (result.files && result.files.length > 0) {
        for (const file of result.files) {
          addTerminalOutput(`📝 Creating/updating ${file.path}...`)
          
          // Update file in store
          const pathParts = file.path.split('/')
          const newFiles = { ...get().files }
          let current = newFiles
          
          // Create directory structure
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i]
            if (!current[part]) {
              current[part] = { directory: {} }
            }
            current = current[part].directory!
          }
          
          const fileName = pathParts[pathParts.length - 1]
          current[fileName] = {
            file: { contents: file.content }
          }
          
          set({ files: newFiles })
          
          // Write to WebContainer if available
          if (webcontainer) {
            try {
              // Ensure directory exists
              const dirPath = pathParts.slice(0, -1).join('/')
              if (dirPath) {
                await webcontainer.fs.mkdir(dirPath, { recursive: true })
              }
              await webcontainer.fs.writeFile(file.path, file.content)
            } catch (error) {
              console.error(`Failed to write ${file.path} to WebContainer:`, error)
              addTerminalOutput(`❌ Failed to write ${file.path}: ${error}`)
            }
          }
        }
        
        addTerminalOutput(`✅ Generated ${result.files.length} file(s)`)
      }
      
      // Install dependencies if specified
      if (result.dependencies && result.dependencies.length > 0) {
        await get().installDependencies(result.dependencies)
      }
      
    } catch (error) {
      console.error('AI generation error:', error)
      addChatMessage('assistant', `Sorry, I encountered an error: ${error}. Please check your Gemini API key and try again.`)
      addTerminalOutput(`❌ AI Error: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  },
  
  installDependencies: async (dependencies: string[]) => {
    const { webcontainer, addTerminalOutput } = get()
    
    if (!webcontainer) {
      addTerminalOutput('❌ WebContainer not ready for dependency installation')
      return
    }
    
    try {
      addTerminalOutput(`📦 Installing dependencies: ${dependencies.join(', ')}...`)
      
      const installProcess = await webcontainer.spawn('npm', ['install', ...dependencies])
      
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          addTerminalOutput(data)
        }
      }))
      
      const exitCode = await installProcess.exit
      
      if (exitCode === 0) {
        addTerminalOutput('✅ Dependencies installed successfully')
      } else {
        addTerminalOutput(`❌ Dependency installation failed with exit code ${exitCode}`)
      }
    } catch (error) {
      console.error('Dependency installation error:', error)
      addTerminalOutput(`❌ Failed to install dependencies: ${error}`)
    }
  },
  
  createNewProject: async (template: ProjectTemplate, projectName: string) => {
    const { webcontainer, addTerminalOutput, setFiles, setActiveFile } = get()
    
    try {
      addTerminalOutput(`🚀 Creating new project: ${projectName}...`)
      addTerminalOutput(`📋 Using template: ${template.name}`)
      
      if (!webcontainer) {
        addTerminalOutput('❌ WebContainer not ready')
        return
      }
      
      // Clear current project
      addTerminalOutput('🧹 Clearing workspace...')
      
      // Convert template files to FileSystemNode format
      const newFiles: FileSystemNode = {}
      
      Object.entries(template.files).forEach(([path, content]) => {
        const pathParts = path.split('/')
        let current = newFiles
        
        // Create directory structure
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          if (!current[part]) {
            current[part] = { directory: {} }
          }
          current = current[part].directory!
        }
        
        // Add file
        const fileName = pathParts[pathParts.length - 1]
        current[fileName] = {
          file: { contents: content }
        }
      })
      
      // Update store files
      setFiles(newFiles)
      
      // Write files to WebContainer
      addTerminalOutput('📁 Setting up file structure...')
      
      for (const [path, content] of Object.entries(template.files)) {
        try {
          // Ensure directory exists
          const dirPath = path.split('/').slice(0, -1).join('/')
          if (dirPath) {
            await webcontainer.fs.mkdir(dirPath, { recursive: true })
          }
          
          await webcontainer.fs.writeFile(path, content)
          addTerminalOutput(`✅ Created ${path}`)
        } catch (error) {
          addTerminalOutput(`❌ Failed to create ${path}: ${error}`)
        }
      }
      
      // Install dependencies
      if (template.dependencies.length > 0 || template.devDependencies.length > 0) {
        const allDeps = [...template.dependencies, ...template.devDependencies.map(d => `${d}`)]
        addTerminalOutput('📦 Installing dependencies...')
        
        const installProcess = await webcontainer.spawn('npm', ['install'])
        
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            addTerminalOutput(data)
          }
        }))
        
        await installProcess.exit
      }
      
      // Start development server
      addTerminalOutput('🔥 Starting development server...')
      const devProcess = await webcontainer.spawn('npm', ['run', 'dev'])
      
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          addTerminalOutput(data)
        }
      }))
      
      // Set active file to App component or main file
      const mainFile = template.files['src/App.tsx'] ? 'src/App.tsx' : 
                      template.files['src/app/page.tsx'] ? 'src/app/page.tsx' :
                      Object.keys(template.files)[0]
      
      setActiveFile(mainFile)
      
      addTerminalOutput(`🎉 Project "${projectName}" created successfully!`)
      addTerminalOutput(`📝 Active file: ${mainFile}`)
      
    } catch (error) {
      console.error('Project creation error:', error)
      addTerminalOutput(`❌ Failed to create project: ${error}`)
    }
  },
  
  setShowNewProjectModal: (show: boolean) => set({ showNewProjectModal: show }),
  
  setShowGitHubModal: (show: boolean) => set({ showGitHubModal: show }),
}))
