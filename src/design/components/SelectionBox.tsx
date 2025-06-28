import React from 'react'
import { Position } from '../types'

interface SelectionBoxProps {
  startPosition: Position
  currentPosition: Position
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ startPosition, currentPosition }) => {
  const left = Math.min(startPosition.x, currentPosition.x)
  const top = Math.min(startPosition.y, currentPosition.y)
  const width = Math.abs(currentPosition.x - startPosition.x)
  const height = Math.abs(currentPosition.y - startPosition.y)

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        border: '1px dashed rgba(0, 255, 255, 0.8)',
        background: 'rgba(0, 255, 255, 0.1)',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  )
}

export default SelectionBox
