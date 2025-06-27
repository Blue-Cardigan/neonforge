import React from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import Terminal from './components/Terminal'
import ChatPanel from './components/ChatPanel'
import { useWebContainer } from './hooks/useWebContainer'

function App() {
  useWebContainer()

  return (
    <div className="h-screen w-screen bg-cyber-darker text-white overflow-hidden cyber-grid">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-48 h-48 bg-neon-pink/5 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="flex flex-col h-full relative z-10">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 flex flex-col">
                <CodeEditor />
                <Terminal />
              </div>
              
              <div className="w-1/2 flex flex-col">
                <Preview />
              </div>
            </div>
          </div>
          
          <ChatPanel />
        </div>
      </div>
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="scanline w-full h-full" />
      </div>
    </div>
  )
}

export default App
