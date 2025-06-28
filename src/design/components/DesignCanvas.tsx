import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDesignStore } from '../store'
import { DesignElement, Position } from '../types'
import { 
  viewportToCanvas, 
  canvasToViewport, 
  getElementsAtPosition,
  isElementAtPosition,
  colorToCSS,
  throttle 
} from '../utils/helpers'
import DesignElementComponent from './DesignElementComponent'
import SelectionBox from './SelectionBox'
import ElementResizeHandles from './ElementResizeHandles'

interface DesignCanvasProps {
  className?: string
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<Position | null>(null)

  const {
    currentProject,
    selectedElements,
    hoveredElement,
    dragState,
    viewportState,
    activeTool,
    selectElement,
    selectMultipleElements,
    clearSelection,
    setHoveredElement,
    startDrag,
    updateDrag,
    endDrag,
    setPan,
    setZoom,
    addElement
  } = useDesignStore()

  // Get current frame
  const currentFrame = currentProject?.frames.find(f => f.id === currentProject.activeFrame)
  const elements = currentFrame?.elements || []

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!currentFrame) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const viewportPos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    const canvasPos = viewportToCanvas(viewportPos, viewportState.pan, viewportState.zoom)

    // Handle space + drag for panning
    if (isSpacePressed) {
      setLastPanPoint(viewportPos)
      return
    }

    // Handle tool-specific actions
    if (activeTool !== 'select') {
      handleToolAction(canvasPos)
      return
    }

    // Handle element selection and dragging
    const elementsAtPosition = getElementsAtPosition(elements, canvasPos)
    const topElement = elementsAtPosition[0]

    if (topElement) {
      if (!selectedElements.includes(topElement.id)) {
        if (e.shiftKey) {
          selectElement(topElement.id, true)
        } else {
          selectElement(topElement.id)
        }
      }
      startDrag(topElement.id, canvasPos, 'move')
    } else {
      // Start selection box
      clearSelection()
      startDrag('', canvasPos, 'select')
    }
  }, [
    currentFrame, 
    elements, 
    selectedElements, 
    isSpacePressed, 
    activeTool, 
    viewportState,
    selectElement,
    clearSelection,
    startDrag
  ])

  const handleMouseMove = useCallback(throttle((e: React.MouseEvent) => {
    if (!currentFrame) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const viewportPos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    const canvasPos = viewportToCanvas(viewportPos, viewportState.pan, viewportState.zoom)

    // Handle panning
    if (isSpacePressed && lastPanPoint) {
      const deltaX = viewportPos.x - lastPanPoint.x
      const deltaY = viewportPos.y - lastPanPoint.y
      setPan({
        x: viewportState.pan.x + deltaX,
        y: viewportState.pan.y + deltaY
      })
      setLastPanPoint(viewportPos)
      return
    }

    // Handle dragging
    if (dragState.isDragging) {
      updateDrag(canvasPos)
      return
    }

    // Handle hover
    const elementsAtPosition = getElementsAtPosition(elements, canvasPos)
    const topElement = elementsAtPosition[0]
    setHoveredElement(topElement?.id || null)
  }, 16), [
    currentFrame,
    elements,
    isSpacePressed,
    lastPanPoint,
    dragState.isDragging,
    viewportState,
    setHoveredElement,
    updateDrag,
    setPan
  ])

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      endDrag()
    }
    setLastPanPoint(null)
  }, [dragState.isDragging, endDrag])

  const handleToolAction = useCallback((position: Position) => {
    switch (activeTool) {
      case 'rectangle':
        addElement({
          type: 'container',
          name: 'Rectangle',
          position,
          size: { width: 100, height: 100 },
          style: {
            background: { r: 0, g: 255, b: 255, a: 0.1 },
            border: { width: 2, style: 'solid', color: { r: 0, g: 255, b: 255, a: 1 }, radius: 8 }
          }
        })
        break
      case 'circle':
        addElement({
          type: 'shape',
          name: 'Circle',
          position,
          size: { width: 100, height: 100 },
          style: {
            background: { r: 255, g: 0, b: 255, a: 0.1 },
            border: { width: 2, style: 'solid', color: { r: 255, g: 0, b: 255, a: 1 }, radius: 50 }
          }
        })
        break
      case 'text':
        addElement({
          type: 'text',
          name: 'Text',
          position,
          size: { width: 200, height: 50 },
          content: 'Click to edit',
          typography: {
            fontFamily: 'Orbitron',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: 0,
            textAlign: 'left',
            color: { r: 0, g: 255, b: 255, a: 1 }
          }
        })
        break
    }
  }, [activeTool, addElement])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsSpacePressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false)
        setLastPanPoint(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle wheel events for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = viewportState.zoom * zoomDelta
      setZoom(newZoom)
    } else {
      // Pan
      setPan({
        x: viewportState.pan.x - e.deltaX,
        y: viewportState.pan.y - e.deltaY
      })
    }
  }, [viewportState, setZoom, setPan])

  if (!currentFrame) {
    return (
      <div className={`flex items-center justify-center bg-cyber-darker ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-4">🎨</div>
          <p>No active frame. Create a new project to start designing.</p>
        </div>
      </div>
    )
  }

  // Calculate canvas transform
  const canvasTransform = `translate(${viewportState.pan.x}px, ${viewportState.pan.y}px) scale(${viewportState.zoom})`

  return (
    <div
      ref={canvasRef}
      className={`relative overflow-hidden bg-cyber-darker ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isSpacePressed ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair'
      }}
    >
      {/* Grid */}
      {viewportState.grid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * viewportState.zoom}px ${20 * viewportState.zoom}px`,
            backgroundPosition: `${viewportState.pan.x}px ${viewportState.pan.y}px`
          }}
        />
      )}

      {/* Canvas */}
      <div
        className="absolute"
        style={{
          transform: canvasTransform,
          transformOrigin: '0 0'
        }}
      >
        {/* Frame background */}
        <div
          className="absolute border border-neon-cyan/30"
          style={{
            width: currentFrame.size.width,
            height: currentFrame.size.height,
            background: colorToCSS(currentFrame.background as any)
          }}
        />

        {/* Elements */}
        {elements.map(element => (
          <DesignElementComponent
            key={element.id}
            element={element}
            isSelected={selectedElements.includes(element.id)}
            isHovered={hoveredElement === element.id}
          />
        ))}

        {/* Selection box for multi-select */}
        {dragState.isDragging && dragState.operation === 'select' && (
          <SelectionBox
            startPosition={dragState.startPosition}
            currentPosition={dragState.currentPosition}
          />
        )}

        {/* Resize handles for selected elements */}
        {selectedElements.length === 1 && (
          <ElementResizeHandles
            element={elements.find(el => el.id === selectedElements[0])!}
          />
        )}
      </div>

      {/* Viewport info */}
      <div className="absolute bottom-4 left-4 bg-cyber-dark/80 backdrop-blur-sm border border-neon-cyan/20 rounded px-3 py-1 text-xs text-gray-300">
        {Math.round(viewportState.zoom * 100)}%
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-cyber-dark/80 backdrop-blur-sm border border-neon-cyan/20 rounded px-3 py-2 text-xs text-gray-300">
        <div>Space + Drag to pan</div>
        <div>Ctrl + Scroll to zoom</div>
        <div>Shift + Click to multi-select</div>
      </div>
    </div>
  )
}

export default DesignCanvas
