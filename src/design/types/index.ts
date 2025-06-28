// Core design system types for visual design tool

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Transform {
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number
}

export interface Color {
  r: number
  g: number
  b: number
  a: number
}

export interface Gradient {
  type: 'linear' | 'radial'
  stops: Array<{
    position: number
    color: Color
  }>
  angle?: number
}

export interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: Color
  inset: boolean
}

export interface Border {
  width: number
  style: 'solid' | 'dashed' | 'dotted' | 'none'
  color: Color
  radius: number
}

export interface Typography {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  color: Color
}

export interface StyleProperties {
  background?: Color | Gradient
  border?: Border
  shadow?: Shadow[]
  opacity?: number
  blur?: number
  mixBlendMode?: string
}

export type ElementType = 
  | 'container'
  | 'text'
  | 'image'
  | 'button'
  | 'input'
  | 'icon'
  | 'shape'
  | 'component'

export interface DesignElement {
  id: string
  type: ElementType
  name: string
  position: Position
  size: Size
  transform: Transform
  style: StyleProperties
  typography?: Typography
  content?: string
  src?: string // for images
  children?: string[] // child element IDs
  parent?: string // parent element ID
  locked: boolean
  visible: boolean
  constraints?: {
    horizontal: 'left' | 'right' | 'center' | 'stretch'
    vertical: 'top' | 'bottom' | 'center' | 'stretch'
  }
  // AI-related properties
  prompt?: string
  aiGenerated?: boolean
  originalPrompt?: string
}

export interface DesignFrame {
  id: string
  name: string
  size: Size
  background: Color | Gradient
  elements: DesignElement[]
  selectedElements: string[]
  zoom: number
  pan: Position
}

export interface DesignProject {
  id: string
  name: string
  frames: DesignFrame[]
  activeFrame: string
  components: DesignElement[] // reusable components
  colorPalette: Color[]
  typography: Typography[]
  createdAt: Date
  updatedAt: Date
}

export interface SelectionBox {
  x: number
  y: number
  width: number
  height: number
}

export interface DragState {
  isDragging: boolean
  startPosition: Position
  currentPosition: Position
  elementId?: string
  operation: 'move' | 'resize' | 'rotate' | 'select'
  resizeHandle?: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
}

export interface HistoryState {
  timestamp: Date
  action: string
  before: any
  after: any
}

export interface ViewportState {
  zoom: number
  pan: Position
  guides: boolean
  grid: boolean
  rulers: boolean
}

export interface AIEditRequest {
  elementId: string
  prompt: string
  context: {
    element: DesignElement
    surroundingElements: DesignElement[]
    frameContext: DesignFrame
  }
}

export interface AIEditResponse {
  success: boolean
  changes: Partial<DesignElement>
  explanation: string
  suggestions?: string[]
}
