# 🚀 NeonForge - Cyberpunk AI Code Generation Platform

A cutting-edge, cyberpunk-themed AI code generation platform inspired by Lovable and Bolt, built with React, TypeScript, and WebContainers.

## ✨ Features

- **🚀 New Project Creation**: Start with professional templates in seconds
- **📂 GitHub Integration**: Import repositories and export projects seamlessly
- **🤖 AI-Powered Code Generation**: Chat with Google Gemini to generate and modify code
- **⚡ Real-time Preview**: See your changes instantly with WebContainer technology
- **🎨 Cyberpunk Aesthetic**: Stunning neon-themed UI with smooth animations
- **📁 File Explorer**: Navigate and edit your project files
- **💻 Monaco Editor**: Full-featured code editor with syntax highlighting
- **🖥️ Responsive Preview**: Test your app in desktop, tablet, and mobile views
- **📟 Terminal**: Monitor build processes and container status
- **🔥 Hot Reload**: Instant updates as you code
- **💬 Smart AI Chat**: Context-aware responses based on your current project
- **🎯 Welcome Screen**: Guided onboarding and quick start options
- **🔐 Secure Authentication**: Supabase-powered OAuth for GitHub

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini 1.5 Flash for code generation
- **Authentication**: Supabase for GitHub OAuth
- **Version Control**: GitHub API integration via Octokit
- **Code Editor**: Monaco Editor (VS Code editor)
- **Runtime**: WebContainers (browser-based Node.js environment)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite
- **Styling**: Custom cyberpunk theme with neon effects

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Services (Required for full functionality)**:
   - **Gemini AI**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Supabase**: Create project at [supabase.com](https://supabase.com) for GitHub integration
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your credentials:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     VITE_SUPABASE_URL=your_supabase_url_here
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```
   - For GitHub integration, configure GitHub OAuth in your Supabase project

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the development URL

5. **Start building!** Chat with the AI assistant to generate components and full applications

## 🎨 Design Philosophy

NeonForge embraces a cyberpunk aesthetic with:
- **Neon color palette**: Cyan, pink, and green accents
- **Dark theme**: Deep blacks and grays for comfort
- **Glowing effects**: Text shadows and box shadows for that neon feel
- **Smooth animations**: Framer Motion for fluid interactions
- **Futuristic typography**: Custom fonts and spacing

## 🔧 Architecture

### WebContainer Integration
The platform uses StackBlitz's WebContainer technology to run a complete Node.js environment in the browser:
- Real file system operations
- Package installation with npm
- Development server with hot reload
- Terminal access for monitoring

### Component Structure
```
src/
├── components/
│   ├── Header.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # File explorer
│   ├── CodeEditor.tsx      # Monaco editor integration
│   ├── Preview.tsx         # App preview with responsive modes
│   ├── Terminal.tsx        # Container output display
│   └── ChatPanel.tsx       # AI assistant interface
├── hooks/
│   └── useWebContainer.ts  # WebContainer management
├── store.ts                # Zustand state management
└── App.tsx                 # Main application component
```

## 🎯 Key Features Explained

### AI Code Generation
- Chat-based interface for natural language code requests
- Context-aware responses based on current project
- File generation and modification capabilities
- Quick-start prompts for common tasks

### Real-time Development
- WebContainer boots a complete Node.js environment
- Live file system that syncs with the editor
- Hot reload for instant feedback
- Terminal output for debugging

### Responsive Preview
- Multiple device viewport testing
- External link for full-screen testing
- Refresh and reload capabilities
- Loading states and error handling

## 🎨 Customization

The cyberpunk theme can be customized in `tailwind.config.js`:
- Modify neon colors in the color palette
- Adjust animations and keyframes
- Update fonts and typography
- Change spacing and sizing

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📝 Notes

- Requires modern browsers with SharedArrayBuffer support
- WebContainer needs specific CORS headers (configured in vite.config.ts)
- Some Node.js modules may not work in the browser environment
- AI responses are currently mocked - integrate with OpenAI/Anthropic APIs for real functionality

## 🔮 Future Enhancements

- Real AI API integration
- GitHub integration for project management
- Deployment to Vercel/Netlify
- Template library
- Collaborative editing
- Plugin system

## 🎮 Experience the Future of Coding

NeonForge represents the next evolution in web development tools, combining the power of AI assistance with real-time execution in a visually stunning cyberpunk interface. Welcome to the future of coding! ⚡

---

Built with ❤️ and lots of ☕ by the NeonForge team
