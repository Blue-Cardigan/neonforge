import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DesignElement } from '../types'
import { colorToCSS } from '../utils/helpers'
import { useDesignStore } from '../store'

interface DesignElementComponentProps {
  element: DesignElement
  isSelected: boolean
  isHovered: boolean
}

const DesignElementComponent: React.FC<DesignElementComponentProps> = ({
  element,
  isSelected,
  isHovered
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  
  const { updateElement, selectElement } = useDesignStore()

  const handleDoubleClick = () => {
    if (element.type === 'text') {
      setIsEditing(true)
    }
  }

  const handleTextEdit = (newContent: string) => {
    updateElement(element.id, { content: newContent })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const content = textRef.current?.textContent || ''
      handleTextEdit(content)
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const getElementStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      transform: `
        translate(${element.transform.x}px, ${element.transform.y}px)
        rotate(${element.transform.rotation}deg)
        scale(${element.transform.scaleX}, ${element.transform.scaleY})
      `,
      opacity: element.style.opacity || 1,
      pointerEvents: element.locked ? 'none' : 'auto',
      display: element.visible ? 'block' : 'none'
    }

    // Background
    if (element.style.background) {
      if ('r' in element.style.background) {
        style.backgroundColor = colorToCSS(element.style.background)
      }
      // TODO: Handle gradients
    }

    // Border
    if (element.style.border) {
      style.border = `${element.style.border.width}px ${element.style.border.style} ${colorToCSS(element.style.border.color)}`
      style.borderRadius = element.style.border.radius
    }

    // Shadow
    if (element.style.shadow && element.style.shadow.length > 0) {
      style.boxShadow = element.style.shadow
        .map(shadow => 
          `${shadow.inset ? 'inset ' : ''}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${colorToCSS(shadow.color)}`
        )
        .join(', ')
    }

    // Typography for text elements
    if (element.type === 'text' && element.typography) {
      style.fontFamily = element.typography.fontFamily
      style.fontSize = element.typography.fontSize
      style.fontWeight = element.typography.fontWeight
      style.lineHeight = element.typography.lineHeight
      style.letterSpacing = element.typography.letterSpacing
      style.textAlign = element.typography.textAlign
      style.color = colorToCSS(element.typography.color)
      style.display = 'flex'
      style.alignItems = 'center'
      style.padding = '8px'
    }

    return style
  }

  const getSelectionStyle = (): React.CSSProperties => {
    if (!isSelected && !isHovered) return {}

    return {
      outline: isSelected 
        ? '2px solid rgba(0, 255, 255, 1)' 
        : '1px solid rgba(0, 255, 255, 0.5)',
      outlineOffset: '2px'
    }
  }

  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
        if (isEditing) {
          return (
            <div
              ref={textRef}
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={() => {
                const content = textRef.current?.textContent || ''
                handleTextEdit(content)
              }}
              style={{
                outline: 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {element.content}
            </div>
          )
        }
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            {element.content || 'Click to edit'}
          </div>
        )

      case 'image':
        return element.src ? (
          <img
            src={element.src}
            alt={element.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px'
          }}>
            📷 Image
          </div>
        )

      case 'button':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            {element.content || 'Button'}
          </div>
        )

      case 'input':
        return (
          <input
            type="text"
            placeholder={element.content || 'Input field'}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              padding: '8px'
            }}
          />
        )

      case 'icon':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {element.content || '⭐'}
          </div>
        )

      case 'shape':
      case 'container':
      default:
        return null
    }
  }

  return (
    <motion.div
      style={{
        ...getElementStyle(),
        ...getSelectionStyle()
      }}
      onDoubleClick={handleDoubleClick}
      whileHover={{
        scale: isSelected ? 1 : 1.02
      }}
      transition={{
        duration: 0.1
      }}
      drag={isSelected && !element.locked}
      dragMomentum={false}
      onDragStart={() => {
        // Handle drag start if needed
      }}
      onDrag={(event, info) => {
        // Handle drag if needed
      }}
      onDragEnd={(event, info) => {
        // Update element position
        updateElement(element.id, {
          position: {
            x: element.position.x + info.offset.x,
            y: element.position.y + info.offset.y
          }
        })
      }}
    >
      {renderElementContent()}
      
      {/* Element label for debugging */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            fontSize: '10px',
            color: '#00ffff',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '2px 4px',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {element.name}
        </div>
      )}
    </motion.div>
  )
}

export default DesignElementComponent
