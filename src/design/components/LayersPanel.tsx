import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignStore } from '../store'
import { DesignElement } from '../types'

interface LayersPanelProps {
  className?: string
}

const LayersPanel: React.FC<LayersPanelProps> = ({ className }) => {
  const {
    currentProject,
    selectedElements,
    selectElement,
    selectMultipleElements,
    clearSelection,
    updateElement,
    deleteElement,
    duplicateElement
  } = useDesignStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [draggedElement, setDraggedElement] = useState<string | null>(null)

  // Get current frame and elements
  const currentFrame = currentProject?.frames.find(f => f.id === currentProject.activeFrame)
  const elements = currentFrame?.elements || []

  // Filter elements based on search
  const filteredElements = elements.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle element selection
  const handleElementClick = (elementId: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      selectElement(elementId, true)
    } else if (event.metaKey || event.ctrlKey) {
      selectElement(elementId, true)
    } else {
      selectElement(elementId)
    }
  }

  // Handle visibility toggle
  const handleVisibilityToggle = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const element = elements.find(el => el.id === elementId)
    if (element) {
      updateElement(elementId, { visible: !element.visible })
    }
  }

  // Handle lock toggle
  const handleLockToggle = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const element = elements.find(el => el.id === elementId)
    if (element) {
      updateElement(elementId, { locked: !element.locked })
    }
  }

  // Handle context menu
  const handleContextMenu = (elementId: string, event: React.MouseEvent) => {
    event.preventDefault()
    // TODO: Implement context menu
    console.log('Context menu for element:', elementId)
  }

  // Get element icon based on type
  const getElementIcon = (element: DesignElement) => {
    const icons = {
      container: '📦',
      text: '📝',
      image: '🖼️',
      button: '🔘',
      input: '📄',
      icon: '⭐',
      shape: '🔷',
      component: '🧩'
    }
    return icons[element.type] || '📦'
  }

  // Handle drag start
  const handleDragStart = (elementId: string, event: React.DragEvent) => {
    setDraggedElement(elementId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', elementId)
  }

  // Handle drag over
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  // Handle drop
  const handleDrop = (targetElementId: string, event: React.DragEvent) => {
    event.preventDefault()
    const draggedElementId = event.dataTransfer.getData('text/plain')
    
    if (draggedElementId && draggedElementId !== targetElementId) {
      // Reorder elements logic would go here
      console.log('Reorder:', draggedElementId, 'to', targetElementId)
    }
    
    setDraggedElement(null)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedElement(null)
  }

  return (
    <div className={`bg-cyber-dark border-r border-gray-700 flex flex-col ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-neon-cyan">Layers</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => clearSelection()}
              className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
              title="Clear selection"
            >
              <span className="text-sm">✨</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cyber-darker border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto">
        {filteredElements.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            {searchTerm ? (
              <>
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm">No layers match "{searchTerm}"</p>
              </>
            ) : (
              <>
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm">No layers yet</p>
                <p className="text-xs mt-1">Create elements to see them here</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence>
              {filteredElements.map((element, index) => {
                const isSelected = selectedElements.includes(element.id)
                const isDragging = draggedElement === element.id

                return (
                  <motion.div
                    key={element.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isDragging ? 0.5 : 1, 
                      y: 0,
                      scale: isDragging ? 0.95 : 1
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
                      group flex items-center space-x-2 p-2 rounded cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'bg-neon-cyan/20 border border-neon-cyan' 
                        : 'bg-cyber-darker border border-transparent hover:bg-gray-700 hover:border-gray-600'
                      }
                      ${!element.visible ? 'opacity-50' : ''}
                      ${element.locked ? 'bg-yellow-500/10' : ''}
                    `}
                    onClick={(e) => handleElementClick(element.id, e)}
                    onContextMenu={(e) => handleContextMenu(element.id, e)}
                    draggable
                    onDragStart={(e) => handleDragStart(element.id, e)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(element.id, e)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag Handle */}
                    <div className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <span className="text-xs">⋮⋮</span>
                    </div>

                    {/* Element Icon */}
                    <span className="text-sm">{getElementIcon(element)}</span>

                    {/* Element Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium truncate ${isSelected ? 'text-neon-cyan' : 'text-white'}`}>
                          {element.name}
                        </span>
                        {element.locked && (
                          <span className="text-xs text-yellow-400">🔒</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {element.type} • {Math.round(element.size.width)}×{Math.round(element.size.height)}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Visibility Toggle */}
                      <button
                        onClick={(e) => handleVisibilityToggle(element.id, e)}
                        className={`p-1 rounded transition-colors ${
                          element.visible 
                            ? 'text-gray-400 hover:text-gray-300' 
                            : 'text-gray-600 hover:text-gray-500'
                        }`}
                        title={element.visible ? 'Hide layer' : 'Show layer'}
                      >
                        <span className="text-xs">{element.visible ? '👁️' : '🚫'}</span>
                      </button>

                      {/* Lock Toggle */}
                      <button
                        onClick={(e) => handleLockToggle(element.id, e)}
                        className={`p-1 rounded transition-colors ${
                          element.locked 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={element.locked ? 'Unlock layer' : 'Lock layer'}
                      >
                        <span className="text-xs">{element.locked ? '🔒' : '🔓'}</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {selectedElements.length > 0 && (
        <div className="border-t border-gray-700 p-4">
          <div className="text-xs text-gray-400 mb-3">
            {selectedElements.length} layer{selectedElements.length > 1 ? 's' : ''} selected
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (selectedElements.length === 1) {
                  duplicateElement(selectedElements[0])
                }
              }}
              disabled={selectedElements.length !== 1}
              className="bg-cyber-darker border border-gray-600 rounded px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Duplicate
            </button>
            
            <button
              onClick={() => {
                selectedElements.forEach(id => deleteElement(id))
              }}
              className="bg-red-900/30 border border-red-600 rounded px-3 py-2 text-xs text-red-300 hover:bg-red-900/50 transition-colors"
            >
              Delete
            </button>
          </div>

          {selectedElements.length > 1 && (
            <>
              <div className="my-3 border-t border-gray-700"></div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-cyber-darker border border-gray-600 rounded px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
                  Group
                </button>
                <button className="bg-cyber-darker border border-gray-600 rounded px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
                  Align
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default LayersPanel