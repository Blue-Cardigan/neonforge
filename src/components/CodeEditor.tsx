import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { useAppStore } from '../store'

const CodeEditor: React.FC = () => {
  const { files, activeFile, updateFileContent, webcontainer } = useAppStore()
  const editorRef = useRef<any>(null)

  const getFileContent = (path: string): string => {
    if (!path) return ''
    
    const pathParts = path.split('/')
    let current = files
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i]
      if (current[part]?.directory) {
        current = current[part].directory
      } else {
        return ''
      }
    }
    
    const fileName = pathParts[pathParts.length - 1]
    return current[fileName]?.file?.contents || ''
  }

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return 'typescript'
      case 'ts':
        return 'typescript'
      case 'js':
        return 'javascript'
      case 'css':
        return 'css'
      case 'html':
        return 'html'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      default:
        return 'plaintext'
    }
  }

  const handleEditorChange = async (value: string | undefined) => {
    if (!activeFile || !value) return
    
    updateFileContent(activeFile, value)
    
    // Update the file in WebContainer
    if (webcontainer) {
      try {
        await webcontainer.fs.writeFile(activeFile, value)
      } catch (error) {
        console.error('Failed to write file to WebContainer:', error)
      }
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Set cyberpunk theme
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00FFFF', fontStyle: 'bold' },
        { token: 'string', foreground: 'FF00FF' },
        { token: 'number', foreground: '00FF00' },
        { token: 'identifier', foreground: 'FFFFFF' },
        { token: 'type', foreground: '8B00FF' },
        { token: 'function', foreground: '0080FF' },
      ],
      colors: {
        'editor.background': '#0a0a0f',
        'editor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#1a1a2e50',
        'editor.selectionBackground': '#00ffff30',
        'editor.cursor': '#00ffff',
        'editorLineNumber.foreground': '#6a6a6a',
        'editorLineNumber.activeForeground': '#00ffff',
        'editor.wordHighlightBackground': '#ff00ff20',
        'editor.wordHighlightStrongBackground': '#00ff0020',
      }
    })
    
    monaco.editor.setTheme('cyberpunk')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col bg-cyber-dark/50 border border-neon-cyan/20"
    >
      <div className="h-10 bg-cyber-gray/50 border-b border-neon-cyan/20 flex items-center px-4">
        <div className="flex items-center space-x-2">
          {activeFile ? (
            <>
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
              <span className="text-sm text-neon-cyan font-mono">{activeFile}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 font-mono">No file selected</span>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={getLanguage(activeFile)}
            value={getFileContent(activeFile)}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              contextmenu: false,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                ⚡
              </motion.div>
              <p className="text-lg font-cyber">Select a file to start coding</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CodeEditor
