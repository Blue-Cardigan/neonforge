import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useAppStore } from '../store'

const Preview: React.FC = () => {
  const { serverUrl, isContainerReady } = useAppStore()
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isLoading, setIsLoading] = useState(false)
  const [key, setKey] = useState(0)

  const handleRefresh = () => {
    setIsLoading(true)
    setKey(prev => prev + 1)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const getFrameStyle = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px', margin: '0 auto' }
      case 'tablet':
        return { width: '768px', height: '1024px', margin: '0 auto' }
      default:
        return { width: '100%', height: '100%' }
    }
  }

  useEffect(() => {
    if (serverUrl) {
      setIsLoading(false)
    }
  }, [serverUrl])

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col bg-cyber-gray/30 backdrop-blur-sm border-l border-neon-cyan/30"
    >
      <div className="h-14 bg-cyber-dark/50 border-b border-neon-cyan/20 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-sm text-neon-cyan font-cyber font-semibold">Preview</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-cyber-gray/50 rounded p-1 space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('desktop')}
              className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-neon-cyan text-cyber-dark' : 'text-gray-400 hover:text-white'}`}
            >
              <Monitor className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('tablet')}
              className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-neon-cyan text-cyber-dark' : 'text-gray-400 hover:text-white'}`}
            >
              <Tablet className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('mobile')}
              className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-neon-cyan text-cyber-dark' : 'text-gray-400 hover:text-white'}`}
            >
              <Smartphone className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={!serverUrl || isLoading}
            className="p-2 rounded hover:bg-cyber-light/50 text-gray-400 hover:text-neon-cyan disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {serverUrl && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open(serverUrl, '_blank')}
              className="p-2 rounded hover:bg-cyber-light/50 text-gray-400 hover:text-neon-cyan"
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {!isContainerReady ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-4xl mb-4 text-neon-cyan"
              >
                ⚡
              </motion.div>
              <p className="text-lg text-gray-300 font-cyber">Initializing WebContainer...</p>
              <div className="mt-4 flex justify-center">
                <div className="w-32 h-1 bg-cyber-gray rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : !serverUrl ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl mb-4 text-yellow-500">⚠️</div>
              <p className="text-lg text-gray-300">Waiting for development server...</p>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="h-full flex justify-center"
            style={{ minHeight: viewMode === 'desktop' ? 'auto' : '700px' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="bg-white rounded-lg overflow-hidden shadow-2xl relative"
              style={getFrameStyle()}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-cyber-dark/80 flex items-center justify-center z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-2xl text-neon-cyan"
                  >
                    ⚡
                  </motion.div>
                </div>
              )}
              <iframe
                key={key}
                src={serverUrl}
                className="w-full h-full border-0"
                title="Preview"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Preview
