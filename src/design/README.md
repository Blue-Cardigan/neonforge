# NeonForge Design System

A Figma-like visual design tool with AI-powered element editing and drag-and-drop functionality.

## ✅ Completed Components

### Core Types (`/types/index.ts`)
- Complete design system type definitions
- Element types, positioning, styling, and AI integration types

### Store Management (`/store.ts`)
- Zustand-based state management
- Project, frame, and element management
- Drag & drop state
- AI interaction state
- History/undo system

### Utility Functions (`/utils/helpers.ts`)
- Position and size calculations
- Element selection and hit testing
- Color conversion utilities
- Viewport transformations
- Performance optimization helpers

### UI Components

#### ✅ DesignCanvas (`/components/DesignCanvas.tsx`)
- Main design surface with zoom/pan
- Element rendering and interaction
- Tool-based element creation
- Mouse/keyboard event handling
- Grid and guides system

#### ✅ DesignElementComponent (`/components/DesignElementComponent.tsx`)
- Individual element rendering
- Text editing capabilities
- Visual styling application
- Selection and hover states

#### ✅ SelectionBox (`/components/SelectionBox.tsx`)
- Multi-selection rectangle
- Real-time selection feedback

#### ✅ ElementResizeHandles (`/components/ElementResizeHandles.tsx`)
- Resize handles for selected elements
- 8-point resize system
- Visual resize feedback

#### ✅ AIPropertiesPanel (`/components/AIPropertiesPanel.tsx`)
- AI chat interface for element editing
- Manual property controls
- Color, size, position editing
- Typography controls
- Element metadata

#### ✅ Toolbar (`/components/Toolbar.tsx`)
- Tool selection (select, rectangle, circle, text, image, component)
- Quick actions (duplicate, delete, undo, redo)
- Keyboard shortcuts
- View controls

#### ✅ LayersPanel (`/components/LayersPanel.tsx`)
- Hierarchical element list
- Drag reordering
- Visibility/lock toggles
- Search functionality
- Multi-selection actions

## 🎯 Key Features

### Visual Design
- ✅ Drag-and-drop element manipulation
- ✅ Multi-selection with selection box
- ✅ Resize handles with visual feedback
- ✅ Tool-based element creation
- ✅ Zoom and pan viewport
- ✅ Grid and snap guides

### AI Integration
- ✅ Natural language element editing
- ✅ AI chat interface in properties panel
- ✅ Context-aware AI suggestions
- ✅ Edit history tracking

### Layer Management
- ✅ Hierarchical layer organization
- ✅ Drag-to-reorder layers
- ✅ Visibility and lock controls
- ✅ Layer search and filtering

### Property Editing
- ✅ Manual property controls
- ✅ Color picker integration
- ✅ Typography controls
- ✅ Position and size inputs
- ✅ Border and opacity controls

## 🚀 Usage

### Basic Setup
```tsx
import { DesignCanvas, Toolbar, LayersPanel, AIPropertiesPanel } from './design'

function DesignApp() {
  return (
    <div className="flex h-screen">
      <Toolbar className="w-60" />
      <LayersPanel className="w-80" />
      <DesignCanvas className="flex-1" />
      <AIPropertiesPanel className="w-80" />
    </div>
  )
}
```

### Store Usage
```tsx
import { useDesignStore } from './design'

function Component() {
  const {
    selectedElements,
    selectElement,
    addElement,
    updateElement,
    processAIEdit
  } = useDesignStore()
  
  // Use store methods...
}
```

## 🎨 Styling

The design system uses a cyberpunk/neon theme with:
- Dark backgrounds (`cyber-dark`, `cyber-darker`)
- Neon accent colors (`neon-cyan`, `neon-pink`)
- Glassmorphism effects
- Smooth animations with Framer Motion

## ⌨️ Keyboard Shortcuts

- `V` - Select tool
- `R` - Rectangle tool
- `O` - Circle tool
- `T` - Text tool
- `I` - Image tool
- `C` - Component tool
- `⌘D` - Duplicate selected
- `⌘Z` - Undo
- `⌘⇧Z` - Redo
- `Delete` - Delete selected
- `Space + Drag` - Pan canvas
- `⌘ + Scroll` - Zoom

## 🔧 Next Steps

1. **Gemini AI Integration** - Replace mock AI with real Gemini service
2. **Enhanced Drag & Drop** - Snap guides, smart spacing
3. **Component System** - Reusable design components
4. **Export System** - Export designs to code/images
5. **Collaboration** - Real-time collaborative editing
6. **Templates** - Pre-built design templates

## 🎯 Architecture

The design system follows a modular architecture:

```
/design/
├── types/           # TypeScript definitions
├── store.ts         # Zustand state management
├── utils/           # Helper functions
└── components/      # React components
    ├── DesignCanvas.tsx
    ├── Toolbar.tsx
    ├── LayersPanel.tsx
    ├── AIPropertiesPanel.tsx
    └── ...
```

Each component is self-contained and communicates through the central Zustand store, making the system scalable and maintainable.
