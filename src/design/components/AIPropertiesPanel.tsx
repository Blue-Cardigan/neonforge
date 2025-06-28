import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignStore } from '../store'
import { DesignElement, Color, Border, StyleProperties } from '../types'
import { colorToCSS, colorToHex, hexToColor } from '../utils/helpers'

interface AIPropertiesPanelProps {
  className?: string
}

const AIPropertiesPanel: React.FC<AIPropertiesPanelProps> = ({ className }) => {
  const {
    currentProject,
    selectedElements,
    selectedElementForAI,
    isAIProcessing,
    aiPanelOpen,
    setSelectedElementForAI,
    processAIEdit,
    updateElement
  } = useDesignStore()

  const [aiPrompt, setAiPrompt] = useState('')
  const [aiHistory, setAiHistory] = useState<Array<{ prompt: string; response: string; timestamp: Date }>>([])

  // Get current frame and selected element
  const currentFrame = currentProject?.frames.find(f => f.id === currentProject.activeFrame)
  const elements = currentFrame?.elements || []
  const selectedElement = selectedElements.length === 1 
    ? elements.find(el => el.id === selectedElements[0])
    : null

  // Auto-select element for AI when selection changes
  useEffect(() => {
    if (selectedElement) {
      setSelectedElementForAI(selectedElement.id)
    }
  }, [selectedElement, setSelectedElementForAI])

  const targetElement = selectedElementForAI 
    ? elements.find(el => el.id === selectedElementForAI)
    : selectedElement

  // Handle AI prompt submission
  const handleAIPrompt = async () => {
    if (!targetElement || !aiPrompt.trim() || isAIProcessing) return

    const request = {
      elementId: targetElement.id,
      prompt: aiPrompt.trim(),
      context: {
        element: targetElement,
        surroundingElements: elements.filter(el => el.id !== targetElement.id),
        frameContext: currentFrame!
      }
    }

    try {
      await processAIEdit(request)
      
      // Add to history
      setAiHistory(prev => [{
        prompt: aiPrompt.trim(),
        response: `Applied changes to ${targetElement.name}`,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]) // Keep last 10 items

      setAiPrompt('')
    } catch (error) {
      console.error('AI edit failed:', error)
    }
  }

  // Handle manual property updates
  const handlePropertyUpdate = (updates: Partial<DesignElement>) => {
    if (!targetElement) return
    updateElement(targetElement.id, updates)
  }

  // Color input helper component
  const ColorInput: React.FC<{
    label: string
    color: Color
    onChange: (color: Color) => void
  }> = ({ label, color, onChange }) => {
    const hexValue = colorToHex(color)
    
    return (
      <div className="space-y-2">
        <label className="text-xs text-gray-300 uppercase tracking-wide">{label}</label>
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
            style={{ backgroundColor: colorToCSS(color) }}
            onClick={() => {
              // This would open a color picker in a real implementation
              console.log('Color picker would open here')
            }}
          />
          <input
            type="text"
            value={hexValue}
            onChange={(e) => {
              try {
                const newColor = hexToColor(e.target.value)
                onChange(newColor)
              } catch {
                // Invalid hex, ignore
              }
            }}
            className="flex-1 bg-cyber-dark border border-gray-600 rounded px-2 py-1 text-xs text-white"
            placeholder="#00FFFF"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={color.a}
            onChange={(e) => onChange({ ...color, a: parseFloat(e.target.value) })}
            className="w-12"
          />
        </div>
      </div>
    )
  }

  if (!targetElement) {
    return (
      <div className={`bg-cyber-dark border-l border-gray-700 ${className}`}>
        <div className="p-6 text-center text-gray-400">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-cyber-dark border-l border-gray-700 flex flex-col ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-bold text-neon-cyan mb-1">AI Properties</h2>
        <p className="text-xs text-gray-400">{targetElement.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* AI Chat Interface */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">AI Assistant</h3>
          
          {/* AI Input */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe how you want to modify this element..."
                className="w-full bg-cyber-darker border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 resize-none"
                rows={3}
                disabled={isAIProcessing}
              />
              {isAIProcessing && (
                <div className="absolute inset-0 bg-cyber-darker/80 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-neon-cyan border-t-transparent" />
                </div>
              )}
            </div>
            
            <button
              onClick={handleAIPrompt}
              disabled={!aiPrompt.trim() || isAIProcessing}
              className="w-full bg-neon-cyan text-cyber-dark font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-cyan/90 transition-colors"
            >
              {isAIProcessing ? 'Processing...' : 'Apply AI Changes'}
            </button>
          </div>

          {/* AI Suggestions */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
            <div className="grid grid-cols-1 gap-1">
              {[
                'Make it glow',
                'Change to blue',
                'Make it bigger',
                'Add shadow',
                'Make it transparent'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAiPrompt(suggestion)}
                  className="text-left px-2 py-1 text-xs text-neon-cyan hover:bg-cyber-darker rounded transition-colors"
                  disabled={isAIProcessing}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* AI History */}
          {aiHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Recent changes:</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {aiHistory.map((item, index) => (
                  <div key={index} className="bg-cyber-darker rounded p-2">
                    <p className="text-xs text-neon-cyan">"{item.prompt}"</p>
                    <p className="text-xs text-gray-400 mt-1">{item.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manual Properties */}
        <div className="p-4 space-y-6">
          <h3 className="text-sm font-semibold text-white">Manual Properties</h3>

          {/* Position & Size */}
          <div className="space-y-4">
            <h4 className="text-xs text-gray-300 uppercase tracking-wide">Position & Size</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400">X</label>
                <input
                  type="number"
                  value={Math.round(targetElement.position.x)}
                  onChange={(e) => handlePropertyUpdate({
                    position: { ...targetElement.position, x: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Y</label>
                <input
                  type="number"
                  value={Math.round(targetElement.position.y)}
                  onChange={(e) => handlePropertyUpdate({
                    position: { ...targetElement.position, y: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Width</label>
                <input
                  type="number"
                  value={Math.round(targetElement.size.width)}
                  onChange={(e) => handlePropertyUpdate({
                    size: { ...targetElement.size, width: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Height</label>
                <input
                  type="number"
                  value={Math.round(targetElement.size.height)}
                  onChange={(e) => handlePropertyUpdate({
                    size: { ...targetElement.size, height: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Rotation</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={targetElement.transform.rotation}
                onChange={(e) => handlePropertyUpdate({
                  transform: { ...targetElement.transform, rotation: parseFloat(e.target.value) }
                })}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{Math.round(targetElement.transform.rotation)}°</div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h4 className="text-xs text-gray-300 uppercase tracking-wide">Appearance</h4>

            {/* Background Color */}
            {targetElement.style?.background && typeof targetElement.style.background === 'object' && 'r' in targetElement.style.background && (
              <ColorInput
                label="Background"
                color={targetElement.style.background as Color}
                onChange={(color) => handlePropertyUpdate({
                  style: { ...targetElement.style, background: color }
                })}
              />
            )}

            {/* Opacity */}
            <div>
              <label className="text-xs text-gray-300 uppercase tracking-wide">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={targetElement.style?.opacity ?? 1}
                onChange={(e) => handlePropertyUpdate({
                  style: { ...targetElement.style, opacity: parseFloat(e.target.value) }
                })}
                className="w-full mt-2"
              />
              <div className="text-xs text-gray-400 mt-1">{Math.round((targetElement.style?.opacity ?? 1) * 100)}%</div>
            </div>

            {/* Border */}
            {targetElement.style?.border && (
              <div className="space-y-3">
                <label className="text-xs text-gray-300 uppercase tracking-wide">Border</label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Width</label>
                    <input
                      type="number"
                      value={targetElement.style.border.width}
                      onChange={(e) => handlePropertyUpdate({
                        style: {
                          ...targetElement.style,
                          border: { ...targetElement.style.border!, width: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Radius</label>
                    <input
                      type="number"
                      value={targetElement.style.border.radius}
                      onChange={(e) => handlePropertyUpdate({
                        style: {
                          ...targetElement.style,
                          border: { ...targetElement.style.border!, radius: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>

                <ColorInput
                  label="Border Color"
                  color={targetElement.style.border.color}
                  onChange={(color) => handlePropertyUpdate({
                    style: {
                      ...targetElement.style,
                      border: { ...targetElement.style.border!, color }
                    }
                  })}
                />

                <div>
                  <label className="text-xs text-gray-400">Style</label>
                  <select
                    value={targetElement.style.border.style}
                    onChange={(e) => handlePropertyUpdate({
                      style: {
                        ...targetElement.style,
                        border: { ...targetElement.style.border!, style: e.target.value as Border['style'] }
                      }
                    })}
                    className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Text Properties */}
          {targetElement.type === 'text' && targetElement.typography && (
            <div className="space-y-4">
              <h4 className="text-xs text-gray-300 uppercase tracking-wide">Typography</h4>
              
              <div>
                <label className="text-xs text-gray-400">Font Size</label>
                <input
                  type="number"
                  value={targetElement.typography.fontSize}
                  onChange={(e) => handlePropertyUpdate({
                    typography: { ...targetElement.typography!, fontSize: parseFloat(e.target.value) || 12 }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Font Weight</label>
                <select
                  value={targetElement.typography.fontWeight}
                  onChange={(e) => handlePropertyUpdate({
                    typography: { ...targetElement.typography!, fontWeight: parseInt(e.target.value) }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="100">Thin</option>
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </select>
              </div>

              <ColorInput
                label="Text Color"
                color={targetElement.typography.color}
                onChange={(color) => handlePropertyUpdate({
                  typography: { ...targetElement.typography!, color }
                })}
              />

              <div>
                <label className="text-xs text-gray-400">Text Align</label>
                <select
                  value={targetElement.typography.textAlign}
                  onChange={(e) => handlePropertyUpdate({
                    typography: { ...targetElement.typography!, textAlign: e.target.value as any }
                  })}
                  className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
            </div>
          )}

          {/* Element Info */}
          <div className="space-y-4">
            <h4 className="text-xs text-gray-300 uppercase tracking-wide">Element Info</h4>
            
            <div>
              <label className="text-xs text-gray-400">Name</label>
              <input
                type="text"
                value={targetElement.name}
                onChange={(e) => handlePropertyUpdate({ name: e.target.value })}
                className="w-full bg-cyber-darker border border-gray-600 rounded px-2 py-1 text-xs text-white"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={targetElement.visible}
                  onChange={(e) => handlePropertyUpdate({ visible: e.target.checked })}
                  className="rounded border-gray-600"
                />
                <span className="text-xs text-gray-400">Visible</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={targetElement.locked}
                  onChange={(e) => handlePropertyUpdate({ locked: e.target.checked })}
                  className="rounded border-gray-600"
                />
                <span className="text-xs text-gray-400">Locked</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIPropertiesPanel