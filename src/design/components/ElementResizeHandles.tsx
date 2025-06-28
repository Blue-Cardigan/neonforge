import React from 'react'
import { DesignElement } from '../types'
import { getResizeCursor } from '../utils/helpers'
import { useDesignStore } from '../store'

interface ElementResizeHandlesProps {
  element: DesignElement
}

const ElementResizeHandles: React.FC<ElementResizeHandlesProps> = ({ element }) => {
  const { updateElement } = useDesignStore()

  const handleSize = 8
  const offset = handleSize / 2

  const handles = [
    { id: 'nw', x: -offset, y: -offset, cursor: 'nw-resize' },
    { id: 'n', x: element.size.width / 2 - offset, y: -offset, cursor: 'n-resize' },
    { id: 'ne', x: element.size.width - offset, y: -offset, cursor: 'ne-resize' },
    { id: 'e', x: element.size.width - offset, y: element.size.height / 2 - offset, cursor: 'e-resize' },
    { id: 'se', x: element.size.width - offset, y: element.size.height - offset, cursor: 'se-resize' },
    { id: 's', x: element.size.width / 2 - offset, y: element.size.height - offset, cursor: 's-resize' },
    { id: 'sw', x: -offset, y: element.size.height - offset, cursor: 'sw-resize' },
    { id: 'w', x: -offset, y: element.size.height / 2 - offset, cursor: 'w-resize' }
  ]

  const handleMouseDown = (handleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = element.size.width
    const startHeight = element.size.height
    const startLeft = element.position.x
    const startTop = element.position.y

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft
      let newTop = startTop

      switch (handleId) {
        case 'nw':
          newWidth = startWidth - deltaX
          newHeight = startHeight - deltaY
          newLeft = startLeft + deltaX
          newTop = startTop + deltaY
          break
        case 'n':
          newHeight = startHeight - deltaY
          newTop = startTop + deltaY
          break
        case 'ne':
          newWidth = startWidth + deltaX
          newHeight = startHeight - deltaY
          newTop = startTop + deltaY
          break
        case 'e':
          newWidth = startWidth + deltaX
          break
        case 'se':
          newWidth = startWidth + deltaX
          newHeight = startHeight + deltaY
          break
        case 's':
          newHeight = startHeight + deltaY
          break
        case 'sw':
          newWidth = startWidth - deltaX
          newHeight = startHeight + deltaY
          newLeft = startLeft + deltaX
          break
        case 'w':
          newWidth = startWidth - deltaX
          newLeft = startLeft + deltaX
          break
      }

      // Minimum size constraints
      newWidth = Math.max(20, newWidth)
      newHeight = Math.max(20, newHeight)

      updateElement(element.id, {
        size: { width: newWidth, height: newHeight },
        position: { x: newLeft, y: newTop }
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = getResizeCursor(handleId)
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        pointerEvents: 'none'
      }}
    >
      {handles.map(handle => (
        <div
          key={handle.id}
          onMouseDown={(e) => handleMouseDown(handle.id, e)}
          style={{
            position: 'absolute',
            left: handle.x,
            top: handle.y,
            width: handleSize,
            height: handleSize,
            background: '#00ffff',
            border: '1px solid #ffffff',
            borderRadius: '2px',
            cursor: handle.cursor,
            pointerEvents: 'auto',
            zIndex: 1001
          }}
        />
      ))}
    </div>
  )
}

export default ElementResizeHandles
