import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Github, Download, Play, Plus } from 'lucide-react'
import { useAppStore } from '../store'

const Header: React.FC = () => {
  const { isContainerReady, serverUrl, setShowNewProjectModal, setShowGitHubModal } = useAppStore()

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-16 bg-cyber-dark/80 backdrop-blur-sm border-b border-neon-cyan/30 flex items-center justify-between px-6"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-8 h-8 text-neon-cyan animate-pulse-neon" />
          <h1 className="text-2xl font-cyber font-bold text-white">
            <span className="text-neon-cyan">Neon</span>
            <span className="text-neon-pink">Forge</span>
          </h1>
        </motion.div>
        
        <div className="h-6 w-px bg-neon-cyan/50" />
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isContainerReady ? 'bg-neon-green animate-pulse' : 'bg-yellow-500'}`} />
          <span className="text-sm text-gray-300">
            {isContainerReady ? 'Container Ready' : 'Initializing...'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewProjectModal(true)}
          className="btn-neon text-sm px-3 py-1 border-neon-pink text-neon-pink hover:bg-neon-pink"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          New Project
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-neon text-sm px-3 py-1"
          disabled={!serverUrl}
        >
          <Play className="w-4 h-4 inline mr-1" />
          Deploy
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-neon text-sm px-3 py-1 border-neon-pink text-neon-pink hover:bg-neon-pink"
        >
          <Download className="w-4 h-4 inline mr-1" />
          Export
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGitHubModal(true)}
          className="btn-neon text-sm px-3 py-1 border-neon-green text-neon-green hover:bg-neon-green"
        >
          <Github className="w-4 h-4 inline mr-1" />
          GitHub
        </motion.button>
      </div>
    </motion.header>
  )
}

export default Header
