import React from 'react'
import { motion } from 'framer-motion'
import { useDesignStore } from '../store'

interface ToolbarProps {
  className?: string
}

const tools = [
  {
    id: 'select',
    name: 'Select',
    icon: '⭐',
    description: 'Select and move elements',
    shortcut: 'V'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: '⬜',
    description: 'Create rectangle',
    shortcut: 'R'
  },
  {
    id: 'circle',
    name: 'Circle', 
    icon: '⭕',
    description: 'Create circle',
    shortcut: 'O'
  },
  {
    id: 'text',
    name: 'Text',
    icon: '📝',
    description: 'Add text',
    shortcut: 'T'
  },
  {
    id: 'image',
    name: 'Image',
    icon: '🖼️',
    description: 'Add image',
    shortcut: 'I'
  },
  {
    id: 'component',
    name: 'Component',
    icon: '🧩',
    description: 'Add component',
    shortcut: 'C'
  }
] as const

const Toolbar: React.FC<ToolbarProps> = ({ className }) => {
  const { 
    activeTool, 
    setActiveTool,
    selectedElements,
    duplicateElement,
    deleteElement,
    undo,
    redo,
    history,
    historyIndex
  } = useDesignStore()

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Tool shortcuts
      const tool = tools.find(t => t.shortcut.toLowerCase() === e.key.toLowerCase())
      if (tool) {
        e.preventDefault()
        setActiveTool(tool.id as any)
        return
      }

      // Action shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault()
            if (selectedElements.length === 1) {
              duplicateElement(selectedElements[0])
            }
            break
          case 'z':
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
        }
      }

      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedElements.forEach(id => deleteElement(id))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveTool, selectedElements, duplicateElement, deleteElement, undo, redo])

  const handleDuplicate = () => {
    if (selectedElements.length === 1) {
      duplicateElement(selectedElements[0])
    }
  }

  const handleDelete = () => {
    selectedElements.forEach(id => deleteElement(id))
  }

  const canUndo = historyIndex >= 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div className={`bg-cyber-dark border-r border-gray-700 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-bold text-neon-cyan mb-1">Tools</h2>
        <p className="text-xs text-gray-400">Design toolkit</p>
      </div>

      {/* Tools */}
      <div className="p-4 space-y-2">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id
          
          return (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200
                ${isActive 
                  ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan' 
                  : 'bg-cyber-darker border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={`${tool.description} (${tool.shortcut})`}
            >
              <span className="text-lg">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tool.name}</div>
                <div className="text-xs opacity-70 truncate">{tool.shortcut}</div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        
        <button 
          onClick={handleDuplicate}
          disabled={selectedElements.length !== 1}
          className="w-full flex items-center space-x-2 p-2 rounded text-left text-xs text-gray-400 hover:bg-cyber-darker hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>⌘</span>
          <span>Duplicate</span>
          <span className="ml-auto text-xs opacity-50">⌘D</span>
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={selectedElements.length === 0}
          className="w-full flex items-center space-x-2 p-2 rounded text-left text-xs text-gray-400 hover:bg-cyber-darker hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>🗑️</span>
          <span>Delete</span>
          <span className="ml-auto text-xs opacity-50">Del</span>
        </button>
        
        <button 
          onClick={undo}
          disabled={!canUndo}
          className="w-full flex items-center space-x-2 p-2 rounded text-left text-xs text-gray-400 hover:bg-cyber-darker hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>↩️</span>
          <span>Undo</span>
          <span className="ml-auto text-xs opacity-50">⌘Z</span>
        </button>
        
        <button 
          onClick={redo}
          disabled={!canRedo}
          className="w-full flex items-center space-x-2 p-2 rounded text-left text-xs text-gray-400 hover:bg-cyber-darker hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>↪️</span>
          <span>Redo</span>
          <span className="ml-auto text-xs opacity-50">⌘⇧Z</span>
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
          View
        </h3>
        
        <div className="flex items-center space-x-2">
          <button className="flex-1 bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
            Fit
          </button>
          <button className="flex-1 bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
            100%
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Grid</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-neon-cyan"></div>
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Snap</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-neon-cyan"></div>
          </label>
        </div>
      </div>

      {/* Help */}
      <div className="border-t border-gray-700 p-4">
        <button className="w-full bg-cyber-darker border border-gray-600 rounded px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
          <span className="mr-2">❓</span>
          Help & Shortcuts
        </button>
      </div>
    </div>
  )
}

export default Toolbar