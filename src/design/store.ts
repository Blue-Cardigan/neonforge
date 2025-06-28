import { create } from 'zustand'
import { 
  DesignProject, 
  DesignFrame, 
  DesignElement, 
  DragState, 
  ViewportState, 
  Position, 
  Size,
  AIEditRequest,
  HistoryState
} from './types'
import { generateId } from './utils/helpers'

interface DesignStore {
  // Project state
  currentProject: DesignProject | null
  
  // Canvas state
  selectedElements: string[]
  hoveredElement: string | null
  dragState: DragState
  viewportState: ViewportState
  
  // Tools
  activeTool: 'select' | 'text' | 'rectangle' | 'circle' | 'image' | 'component'
  
  // History
  history: HistoryState[]
  historyIndex: number
  
  // AI state
  isAIProcessing: boolean
  aiPanelOpen: boolean
  selectedElementForAI: string | null
  
  // Actions
  setCurrentProject: (project: DesignProject) => void
  createNewProject: (name: string) => void
  
  // Frame management
  addFrame: (frame: Partial<DesignFrame>) => void
  setActiveFrame: (frameId: string) => void
  updateFrame: (frameId: string, updates: Partial<DesignFrame>) => void
  
  // Element management
  addElement: (element: Partial<DesignElement>, frameId?: string) => void
  updateElement: (elementId: string, updates: Partial<DesignElement>) => void
  deleteElement: (elementId: string) => void
  duplicateElement: (elementId: string) => void
  
  // Selection
  selectElement: (elementId: string, addToSelection?: boolean) => void
  selectMultipleElements: (elementIds: string[]) => void
  clearSelection: () => void
  setHoveredElement: (elementId: string | null) => void
  
  // Drag and drop
  startDrag: (elementId: string, startPosition: Position, operation: DragState['operation']) => void
  updateDrag: (currentPosition: Position) => void
  endDrag: () => void
  
  // Viewport
  setZoom: (zoom: number) => void
  setPan: (pan: Position) => void
  resetViewport: () => void
  
  // Tools
  setActiveTool: (tool: DesignStore['activeTool']) => void
  
  // History
  saveState: (action: string, before: any, after: any) => void
  undo: () => void
  redo: () => void
  
  // AI interactions
  setAIPanelOpen: (open: boolean) => void
  setSelectedElementForAI: (elementId: string | null) => void
  processAIEdit: (request: AIEditRequest) => Promise<void>
}

const createDefaultProject = (name: string): DesignProject => ({
  id: generateId(),
  name,
  frames: [{
    id: generateId(),
    name: 'Frame 1',
    size: { width: 1920, height: 1080 },
    background: { r: 15, g: 15, b: 25, a: 1 }, // Cyberpunk dark background
    elements: [],
    selectedElements: [],
    zoom: 1,
    pan: { x: 0, y: 0 }
  }],
  activeFrame: '',
  components: [],
  colorPalette: [
    { r: 0, g: 255, b: 255, a: 1 }, // neon-cyan
    { r: 255, g: 0, b: 255, a: 1 }, // neon-pink
    { r: 0, g: 255, b: 0, a: 1 },   // neon-green
    { r: 139, g: 0, b: 255, a: 1 }, // neon-purple
  ],
  typography: [{
    fontFamily: 'Orbitron',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: 'left',
    color: { r: 255, g: 255, b: 255, a: 1 }
  }],
  createdAt: new Date(),
  updatedAt: new Date()
})

export const useDesignStore = create<DesignStore>((set, get) => ({
  // Initial state
  currentProject: null,
  selectedElements: [],
  hoveredElement: null,
  dragState: {
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    operation: 'select'
  },
  viewportState: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    guides: true,
    grid: false,
    rulers: true
  },
  activeTool: 'select',
  history: [],
  historyIndex: -1,
  isAIProcessing: false,
  aiPanelOpen: false,
  selectedElementForAI: null,

  // Project actions
  setCurrentProject: (project) => {
    set({ currentProject: project })
    if (project && project.frames.length > 0) {
      set({ currentProject: { ...project, activeFrame: project.frames[0].id } })
    }
  },

  createNewProject: (name) => {
    const project = createDefaultProject(name)
    project.activeFrame = project.frames[0].id
    set({ 
      currentProject: project,
      selectedElements: [],
      history: [],
      historyIndex: -1
    })
  },

  // Frame management
  addFrame: (frameData) => {
    const { currentProject } = get()
    if (!currentProject) return

    const newFrame: DesignFrame = {
      id: generateId(),
      name: `Frame ${currentProject.frames.length + 1}`,
      size: { width: 1920, height: 1080 },
      background: { r: 15, g: 15, b: 25, a: 1 },
      elements: [],
      selectedElements: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
      ...frameData
    }

    set({
      currentProject: {
        ...currentProject,
        frames: [...currentProject.frames, newFrame],
        activeFrame: newFrame.id,
        updatedAt: new Date()
      }
    })
  },

  setActiveFrame: (frameId) => {
    const { currentProject } = get()
    if (!currentProject) return

    set({
      currentProject: { ...currentProject, activeFrame: frameId },
      selectedElements: []
    })
  },

  updateFrame: (frameId, updates) => {
    const { currentProject } = get()
    if (!currentProject) return

    const frames = currentProject.frames.map(frame =>
      frame.id === frameId ? { ...frame, ...updates } : frame
    )

    set({
      currentProject: {
        ...currentProject,
        frames,
        updatedAt: new Date()
      }
    })
  },

  // Element management
  addElement: (elementData, frameId) => {
    const { currentProject, saveState } = get()
    if (!currentProject) return

    const activeFrameId = frameId || currentProject.activeFrame
    const frame = currentProject.frames.find(f => f.id === activeFrameId)
    if (!frame) return

    const newElement: DesignElement = {
      id: generateId(),
      type: 'container',
      name: 'New Element',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
      style: {
        background: { r: 26, g: 26, b: 46, a: 1 },
        border: { width: 1, style: 'solid', color: { r: 0, g: 255, b: 255, a: 0.3 }, radius: 8 }
      },
      locked: false,
      visible: true,
      ...elementData
    }

    const updatedFrame = {
      ...frame,
      elements: [...frame.elements, newElement]
    }

    const frames = currentProject.frames.map(f =>
      f.id === activeFrameId ? updatedFrame : f
    )

    const updatedProject = {
      ...currentProject,
      frames,
      updatedAt: new Date()
    }

    // Save to history
    saveState('Add Element', frame.elements, updatedFrame.elements)

    set({
      currentProject: updatedProject,
      selectedElements: [newElement.id]
    })
  },

  updateElement: (elementId, updates) => {
    const { currentProject, saveState } = get()
    if (!currentProject) return

    const activeFrame = currentProject.frames.find(f => f.id === currentProject.activeFrame)
    if (!activeFrame) return

    const elementIndex = activeFrame.elements.findIndex(el => el.id === elementId)
    if (elementIndex === -1) return

    const oldElement = activeFrame.elements[elementIndex]
    const updatedElement = { ...oldElement, ...updates }

    const updatedElements = [...activeFrame.elements]
    updatedElements[elementIndex] = updatedElement

    const frames = currentProject.frames.map(f =>
      f.id === currentProject.activeFrame 
        ? { ...f, elements: updatedElements }
        : f
    )

    // Save to history
    saveState('Update Element', oldElement, updatedElement)

    set({
      currentProject: {
        ...currentProject,
        frames,
        updatedAt: new Date()
      }
    })
  },

  deleteElement: (elementId) => {
    const { currentProject, saveState, selectedElements } = get()
    if (!currentProject) return

    const activeFrame = currentProject.frames.find(f => f.id === currentProject.activeFrame)
    if (!activeFrame) return

    const elementToDelete = activeFrame.elements.find(el => el.id === elementId)
    if (!elementToDelete) return

    const updatedElements = activeFrame.elements.filter(el => el.id !== elementId)

    const frames = currentProject.frames.map(f =>
      f.id === currentProject.activeFrame 
        ? { ...f, elements: updatedElements }
        : f
    )

    // Save to history
    saveState('Delete Element', elementToDelete, null)

    set({
      currentProject: {
        ...currentProject,
        frames,
        updatedAt: new Date()
      },
      selectedElements: selectedElements.filter(id => id !== elementId)
    })
  },

  duplicateElement: (elementId) => {
    const { currentProject, addElement } = get()
    if (!currentProject) return

    const activeFrame = currentProject.frames.find(f => f.id === currentProject.activeFrame)
    if (!activeFrame) return

    const elementToDuplicate = activeFrame.elements.find(el => el.id === elementId)
    if (!elementToDuplicate) return

    const duplicatedElement = {
      ...elementToDuplicate,
      id: generateId(),
      name: `${elementToDuplicate.name} Copy`,
      position: {
        x: elementToDuplicate.position.x + 20,
        y: elementToDuplicate.position.y + 20
      }
    }

    addElement(duplicatedElement)
  },

  // Selection
  selectElement: (elementId, addToSelection = false) => {
    const { selectedElements } = get()
    
    if (addToSelection) {
      if (selectedElements.includes(elementId)) {
        set({ selectedElements: selectedElements.filter(id => id !== elementId) })
      } else {
        set({ selectedElements: [...selectedElements, elementId] })
      }
    } else {
      set({ selectedElements: [elementId] })
    }
  },

  selectMultipleElements: (elementIds) => {
    set({ selectedElements: elementIds })
  },

  clearSelection: () => {
    set({ selectedElements: [] })
  },

  setHoveredElement: (elementId) => {
    set({ hoveredElement: elementId })
  },

  // Drag and drop
  startDrag: (elementId, startPosition, operation) => {
    set({
      dragState: {
        isDragging: true,
        startPosition,
        currentPosition: startPosition,
        elementId,
        operation
      }
    })
  },

  updateDrag: (currentPosition) => {
    const { dragState } = get()
    set({
      dragState: {
        ...dragState,
        currentPosition
      }
    })
  },

  endDrag: () => {
    const { dragState, updateElement } = get()
    
    if (dragState.isDragging && dragState.elementId && dragState.operation === 'move') {
      const deltaX = dragState.currentPosition.x - dragState.startPosition.x
      const deltaY = dragState.currentPosition.y - dragState.startPosition.y
      
      // Update element position
      updateElement(dragState.elementId, {
        position: {
          x: dragState.startPosition.x + deltaX,
          y: dragState.startPosition.y + deltaY
        }
      })
    }

    set({
      dragState: {
        isDragging: false,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        operation: 'select'
      }
    })
  },

  // Viewport
  setZoom: (zoom) => {
    const { viewportState } = get()
    set({
      viewportState: { ...viewportState, zoom: Math.max(0.1, Math.min(5, zoom)) }
    })
  },

  setPan: (pan) => {
    const { viewportState } = get()
    set({
      viewportState: { ...viewportState, pan }
    })
  },

  resetViewport: () => {
    set({
      viewportState: {
        zoom: 1,
        pan: { x: 0, y: 0 },
        guides: true,
        grid: false,
        rulers: true
      }
    })
  },

  // Tools
  setActiveTool: (tool) => {
    set({ activeTool: tool })
  },

  // History
  saveState: (action, before, after) => {
    const { history, historyIndex } = get()
    
    const newHistoryItem: HistoryState = {
      timestamp: new Date(),
      action,
      before,
      after
    }

    // Remove any history after current index (for when we undo then make new changes)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newHistoryItem)

    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < 0) return

    const historyItem = history[historyIndex]
    // Apply the 'before' state
    // Implementation depends on the specific action type
    
    set({ historyIndex: historyIndex - 1 })
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return

    const historyItem = history[historyIndex + 1]
    // Apply the 'after' state
    // Implementation depends on the specific action type
    
    set({ historyIndex: historyIndex + 1 })
  },

  // AI interactions
  setAIPanelOpen: (open) => {
    set({ aiPanelOpen: open })
  },

  setSelectedElementForAI: (elementId) => {
    set({ selectedElementForAI: elementId })
  },

  processAIEdit: async (request) => {
    set({ isAIProcessing: true })
    
    try {
      // This would integrate with the Gemini service
      // For now, we'll implement a mock response
      const response = await mockAIEdit(request)
      
      if (response.success) {
        get().updateElement(request.elementId, response.changes)
      }
    } catch (error) {
      console.error('AI edit failed:', error)
    } finally {
      set({ isAIProcessing: false })
    }
  }
}))

// Mock AI edit function - replace with actual Gemini integration
async function mockAIEdit(request: AIEditRequest) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response based on prompt
  const prompt = request.prompt.toLowerCase()
  const changes: Partial<DesignElement> = {}
  
  if (prompt.includes('blue') || prompt.includes('cyan')) {
    changes.style = {
      ...request.context.element.style,
      background: { r: 0, g: 255, b: 255, a: 1 }
    }
  } else if (prompt.includes('pink') || prompt.includes('magenta')) {
    changes.style = {
      ...request.context.element.style,
      background: { r: 255, g: 0, b: 255, a: 1 }
    }
  } else if (prompt.includes('bigger') || prompt.includes('larger')) {
    changes.size = {
      width: request.context.element.size.width * 1.2,
      height: request.context.element.size.height * 1.2
    }
  } else if (prompt.includes('smaller')) {
    changes.size = {
      width: request.context.element.size.width * 0.8,
      height: request.context.element.size.height * 0.8
    }
  }
  
  return {
    success: true,
    changes,
    explanation: `Applied changes based on prompt: "${request.prompt}"`,
    suggestions: ['Try "make it glow"', 'Try "add shadow"', 'Try "make it round"']
  }
}

export default useDesignStore
