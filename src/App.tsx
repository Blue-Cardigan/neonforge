import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import Terminal from './components/Terminal'
import ChatPanel from './components/ChatPanel'
import NewProjectModal from './components/NewProjectModal'
import GitHubModal from './components/GitHubModal'
import WelcomeScreen from './components/WelcomeScreen'

// Design tool components
import DesignCanvas from './design/components/DesignCanvas'
import Toolbar from './design/components/Toolbar'
import LayersPanel from './design/components/LayersPanel'
import AIPropertiesPanel from './design/components/AIPropertiesPanel'

import { useWebContainer } from './hooks/useWebContainer'
import { useAppStore } from './store'
import { useDesignStore } from './design/store'

function App() {
  useWebContainer()
  const { 
    showNewProjectModal, 
    setShowNewProjectModal, 
    showGitHubModal,
    setShowGitHubModal,
    createNewProject, 
    files 
  } = useAppStore()

  const { createNewProject: createNewDesignProject, currentProject } = useDesignStore()
  
  const [mode, setMode] = useState<'code' | 'design'>('design') // Default to design mode
  
  const hasProject = Object.keys(files).length > 0 || currentProject !== null

  // Initialize design project if none exists
  React.useEffect(() => {
    if (!currentProject && mode === 'design') {
      createNewDesignProject('New Design Project')
    }
  }, [currentProject, mode, createNewDesignProject])

  const handleCreateProject = (name: string, template: string) => {
    if (mode === 'design') {
      createNewDesignProject(name)
    } else {
      createNewProject(name, template)
    }
  }

  return (
    <div className="h-screen w-screen bg-cyber-darker text-white overflow-hidden cyber-grid">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-48 h-48 bg-neon-pink/5 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="flex flex-col h-full relative z-10">
        {/* Header with mode toggle */}
        <div className="flex items-center justify-between bg-cyber-dark border-b border-gray-700 px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                <span className="text-cyber-dark font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
                NeonForge
              </span>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex items-center bg-cyber-darker rounded-lg p-1">
              <button
                onClick={() => setMode('code')}
                className={`px-3 py-1 text-sm rounded transition-all ${
                  mode === 'code' 
                    ? 'bg-neon-cyan text-cyber-dark font-semibold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Code Editor
              </button>
              <button
                onClick={() => setMode('design')}
                className={`px-3 py-1 text-sm rounded transition-all ${
                  mode === 'design' 
                    ? 'bg-neon-cyan text-cyber-dark font-semibold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Design Tool
              </button>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-neon-cyan text-cyber-dark px-4 py-2 rounded-lg font-semibold hover:bg-neon-cyan/90 transition-colors"
            >
              New Project
            </button>
          </div>
        </div>
        
        {hasProject ? (
          mode === 'design' ? (
            // Design Tool Layout
            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel: Toolbar + Layers */}
              <div className="w-80 flex">
                <Toolbar className="w-60" />
                <LayersPanel className="flex-1" />
              </div>
              
              {/* Center: Design Canvas */}
              <DesignCanvas className="flex-1" />
              
              {/* Right Panel: AI Properties */}
              <AIPropertiesPanel className="w-80" />
            </div>
          ) : (
            // Code Editor Layout
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              
              <div className="flex-1 flex flex-col">
                <div className="flex flex-1 overflow-hidden">
                  <div className="flex-1 flex flex-col">
                    <CodeEditor />
                    <Terminal />
                  </div>
                  
                  <div className="w-1/2 flex flex-col">
                    <Preview />
                  </div>
                </div>
              </div>
              
              <ChatPanel />
            </div>
          )
        ) : (
          <div className="flex flex-1">
            <WelcomeScreen />
            <ChatPanel />
          </div>
        )}
      </div>
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="scanline w-full h-full" />
      </div>
      
      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
      />
      
      {/* GitHub Modal */}
      <GitHubModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />
    </div>
  )
}

export default App