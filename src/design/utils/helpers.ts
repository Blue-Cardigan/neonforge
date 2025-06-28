import { Position, Size, DesignElement, Color } from '../types'

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Check if point is inside rectangle
export function isPointInRect(point: Position, rect: { x: number, y: number, width: number, height: number }): boolean {
  return point.x >= rect.x && 
         point.x <= rect.x + rect.width && 
         point.y >= rect.y && 
         point.y <= rect.y + rect.height
}

// Check if element is at position
export function isElementAtPosition(element: DesignElement, position: Position): boolean {
  return isPointInRect(position, {
    x: element.position.x,
    y: element.position.y,
    width: element.size.width,
    height: element.size.height
  })
}

// Get elements at position (for selection)
export function getElementsAtPosition(elements: DesignElement[], position: Position): DesignElement[] {
  return elements.filter(element => 
    element.visible && !element.locked && isElementAtPosition(element, position)
  ).sort((a, b) => {
    // Sort by z-index or creation order (last created on top)
    return elements.indexOf(b) - elements.indexOf(a)
  })
}

// Convert color to CSS string
export function colorToCSS(color: Color): string {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${color.a})`
}

// Convert CSS color to Color object
export function cssToColor(css: string): Color {
  // Parse various CSS color formats
  const rgb = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgb) {
    return {
      r: parseInt(rgb[1]),
      g: parseInt(rgb[2]),
      b: parseInt(rgb[3]),
      a: rgb[4] ? parseFloat(rgb[4]) : 1
    }
  }
  
  // Fallback to white
  return { r: 255, g: 255, b: 255, a: 1 }
}

// Calculate distance between two points
export function distance(p1: Position, p2: Position): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// Snap position to grid
export function snapToGrid(position: Position, gridSize: number = 10): Position {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  }
}

// Calculate selection bounds for multiple elements
export function getSelectionBounds(elements: DesignElement[]): { x: number, y: number, width: number, height: number } {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }
  
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  
  elements.forEach(element => {
    minX = Math.min(minX, element.position.x)
    minY = Math.min(minY, element.position.y)
    maxX = Math.max(maxX, element.position.x + element.size.width)
    maxY = Math.max(maxY, element.position.y + element.size.height)
  })
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

// Convert viewport coordinates to canvas coordinates
export function viewportToCanvas(
  viewportPos: Position, 
  pan: Position, 
  zoom: number
): Position {
  return {
    x: (viewportPos.x - pan.x) / zoom,
    y: (viewportPos.y - pan.y) / zoom
  }
}

// Convert canvas coordinates to viewport coordinates
export function canvasToViewport(
  canvasPos: Position, 
  pan: Position, 
  zoom: number
): Position {
  return {
    x: canvasPos.x * zoom + pan.x,
    y: canvasPos.y * zoom + pan.y
  }
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Interpolate between two values
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Generate element name based on type
export function generateElementName(type: string, existingNames: string[]): string {
  let baseName = type.charAt(0).toUpperCase() + type.slice(1)
  let counter = 1
  let name = baseName
  
  while (existingNames.includes(name)) {
    counter++
    name = `${baseName} ${counter}`
  }
  
  return name
}

// Resize element maintaining aspect ratio
export function resizeWithAspectRatio(
  currentSize: Size, 
  newSize: Size, 
  maintainAspectRatio: boolean = false
): Size {
  if (!maintainAspectRatio) {
    return newSize
  }
  
  const aspectRatio = currentSize.width / currentSize.height
  
  // Determine which dimension to prioritize
  const widthBasedHeight = newSize.width / aspectRatio
  const heightBasedWidth = newSize.height * aspectRatio
  
  // Use the smaller of the two to fit within bounds
  if (Math.abs(newSize.height - widthBasedHeight) < Math.abs(newSize.width - heightBasedWidth)) {
    return {
      width: newSize.width,
      height: widthBasedHeight
    }
  } else {
    return {
      width: heightBasedWidth,
      height: newSize.height
    }
  }
}

// Check if two rectangles intersect
export function rectsIntersect(
  rect1: { x: number, y: number, width: number, height: number },
  rect2: { x: number, y: number, width: number, height: number }
): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  )
}

// Get resize cursor for handle
export function getResizeCursor(handle: string): string {
  const cursors: { [key: string]: string } = {
    'nw': 'nw-resize',
    'n': 'n-resize',
    'ne': 'ne-resize',
    'e': 'e-resize',
    'se': 'se-resize',
    's': 's-resize',
    'sw': 'sw-resize',
    'w': 'w-resize'
  }
  return cursors[handle] || 'default'
}

// Format size for display
export function formatSize(size: Size): string {
  return `${Math.round(size.width)} × ${Math.round(size.height)}`
}

// Format position for display
export function formatPosition(position: Position): string {
  return `${Math.round(position.x)}, ${Math.round(position.y)}`
}

// Calculate rotation angle between two points
export function getRotationAngle(center: Position, point: Position): number {
  return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI)
}

// Apply transform to position
export function applyTransform(position: Position, transform: { x: number, y: number, rotation: number, scaleX: number, scaleY: number }): Position {
  // Apply translation
  let x = position.x + transform.x
  let y = position.y + transform.y
  
  // Apply rotation if needed
  if (transform.rotation !== 0) {
    const cos = Math.cos(transform.rotation * Math.PI / 180)
    const sin = Math.sin(transform.rotation * Math.PI / 180)
    const newX = x * cos - y * sin
    const newY = x * sin + y * cos
    x = newX
    y = newY
  }
  
  // Apply scale
  x *= transform.scaleX
  y *= transform.scaleY
  
  return { x, y }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Convert color to hex string
export function colorToHex(color: Color): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

// Convert hex string to color
export function hexToColor(hex: string): Color {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Support 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  if (hex.length !== 6) {
    throw new Error('Invalid hex color format')
  }
  
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
    a: 1
  }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}
