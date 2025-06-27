import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal as TerminalIcon, X, Minimize2 } from 'lucide-react'
import { useAppStore } from '../store'

const Terminal: React.FC = () => {
  const { terminalOutput, clearTerminal } = useAppStore()
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="h-48 bg-cyber-dark/80 backdrop-blur-sm border-t border-neon-cyan/30"
    >
      <div className="h-8 bg-cyber-gray/50 border-b border-neon-cyan/20 flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-neon-green" />
          <span className="text-xs text-neon-green font-cyber font-semibold">TERMINAL</span>
          <div className="flex space-x-1 ml-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-neon-green"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearTerminal}
            className="p-1 rounded hover:bg-cyber-light/50 text-gray-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded hover:bg-cyber-light/50 text-gray-400 hover:text-white"
          >
            <Minimize2 className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-40 overflow-y-auto p-3 font-mono text-xs leading-relaxed"
      >
        {terminalOutput.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500"
          >
            <span className="text-neon-green">neon@forge:~$</span> <span className="terminal-cursor"></span>
          </motion.div>
        ) : (
          <div className="space-y-1">
            {terminalOutput.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex"
              >
                {line.startsWith('🚀') || line.startsWith('📁') || line.startsWith('📦') || line.startsWith('🔥') || line.startsWith('✅') || line.startsWith('🎉') ? (
                  <span className="text-neon-cyan">{line}</span>
                ) : line.startsWith('❌') ? (
                  <span className="text-red-400">{line}</span>
                ) : line.includes('error') || line.includes('Error') ? (
                  <span className="text-red-400">{line}</span>
                ) : line.includes('warn') || line.includes('Warning') ? (
                  <span className="text-yellow-400">{line}</span>
                ) : line.includes('success') || line.includes('✓') ? (
                  <span className="text-neon-green">{line}</span>
                ) : (
                  <span className="text-gray-300">{line}</span>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300"
            >
              <span className="text-neon-green">neon@forge:~$</span> <span className="terminal-cursor"></span>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Terminal
