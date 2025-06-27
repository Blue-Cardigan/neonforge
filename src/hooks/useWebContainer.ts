import { useEffect } from 'react'
import { WebContainer } from '@webcontainer/api'
import { useAppStore } from '../store'

const defaultFiles = {
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'neon-project',
        version: '1.0.0',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1'
        },
        devDependencies: {
          '@types/react': '^18.3.3',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.3.1',
          typescript: '^5.5.3',
          vite: '^5.4.1'
        }
      }, null, 2)
    }
  },
  'vite.config.ts': {
    file: {
      contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})`
    }
  },
  'index.html': {
    file: {
      contents: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Neon Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    }
  },
  src: {
    directory: {
      'main.tsx': {
        file: {
          contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
        }
      },
      'App.tsx': {
        file: {
          contents: `import React from 'react'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>
        🚀 Welcome to NeonForge
      </h1>
      <p style={{ color: '#ffffff' }}>
        Your project has been generated! Start building something amazing.
      </p>
    </div>
  )
}

export default App`
        }
      }
    }
  }
}

export const useWebContainer = () => {
  const {
    webcontainer,
    setWebContainer,
    setContainerReady,
    setServerUrl,
    setFiles,
    addTerminalOutput
  } = useAppStore()

  useEffect(() => {
    const initWebContainer = async () => {
      try {
        addTerminalOutput('🚀 Booting WebContainer...')
        const container = await WebContainer.boot()
        setWebContainer(container)
        
        addTerminalOutput('📁 Mounting file system...')
        await container.mount(defaultFiles)
        setFiles(defaultFiles)
        
        addTerminalOutput('📦 Installing dependencies...')
        const installProcess = await container.spawn('npm', ['install'])
        
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            addTerminalOutput(data)
          }
        }))
        
        await installProcess.exit
        
        addTerminalOutput('🔥 Starting development server...')
        const devProcess = await container.spawn('npm', ['run', 'dev'])
        
        devProcess.output.pipeTo(new WritableStream({
          write(data) {
            addTerminalOutput(data)
          }
        }))
        
        // Wait for server to be ready
        container.on('server-ready', (port, url) => {
          setServerUrl(url)
          addTerminalOutput(`✅ Server ready at ${url}`)
        })
        
        setContainerReady(true)
        addTerminalOutput('🎉 WebContainer ready!')
        
      } catch (error) {
        console.error('Failed to initialize WebContainer:', error)
        addTerminalOutput(`❌ Error: ${error}`)
      }
    }

    if (!webcontainer) {
      initWebContainer()
    }
  }, [webcontainer])

  return { webcontainer }
}
