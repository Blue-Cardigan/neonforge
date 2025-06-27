import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Folder, FolderOpen, Plus, X } from 'lucide-react'
import { useAppStore } from '../store'

const Sidebar: React.FC = () => {
  const { files, activeFile, setActiveFile } = useAppStore()

  const renderFileTree = (nodes: any, path = '', depth = 0) => {
    return Object.entries(nodes).map(([name, node]: [string, any]) => {
      const fullPath = path ? `${path}/${name}` : name
      const isDirectory = node.directory
      const isActive = activeFile === fullPath
      
      return (
        <motion.div
          key={fullPath}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.1 }}
          className={`ml-${depth * 4}`}
        >
          <div
            className={`flex items-center space-x-2 px-2 py-1 cursor-pointer rounded transition-all
              ${isActive ? 'bg-neon-cyan/20 border-l-2 border-neon-cyan' : 'hover:bg-cyber-light/50'}
            `}
            onClick={() => !isDirectory && setActiveFile(fullPath)}
          >
            {isDirectory ? (
              <FolderOpen className="w-4 h-4 text-neon-cyan" />
            ) : (
              <FileText className="w-4 h-4 text-neon-pink" />
            )}
            <span className={`text-sm ${isActive ? 'text-neon-cyan font-semibold' : 'text-gray-300'}`}>
              {name}
            </span>
          </div>
          
          {isDirectory && (
            <div className="ml-4">
              {renderFileTree(node.directory, fullPath, depth + 1)}
            </div>
          )}
        </motion.div>
      )
    })
  }

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-64 bg-cyber-gray/30 backdrop-blur-sm border-r border-neon-cyan/30 flex flex-col"
    >
      <div className="p-4 border-b border-neon-cyan/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-cyber font-semibold text-neon-cyan">Explorer</h2>
          <div className="flex space-x-1">
            <motion.button
              whileHover={{ scale: 1.1, color: '#00ff00' }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded hover:bg-cyber-light/50 text-gray-400"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {renderFileTree(files)}
        </div>
      </div>
      
      <div className="p-4 border-t border-neon-cyan/20">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-neon text-xs py-2"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          New File
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Sidebar
