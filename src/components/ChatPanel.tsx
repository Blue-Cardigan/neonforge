import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles, AlertCircle, Key } from 'lucide-react'
import { useAppStore } from '../store'
import { geminiService } from '../utils/geminiService'

const ChatPanel: React.FC = () => {
  const { 
    chatHistory, 
    isGenerating, 
    generateCodeWithAI,
    addChatMessage
  } = useAppStore()
  
  const [inputValue, setInputValue] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isApiAvailable = geminiService.isAvailable()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    if (!isApiAvailable) {
      addChatMessage('user', inputValue)
      addChatMessage('assistant', '🔑 Please set your Gemini API key first. Click the key icon to configure it.')
      setInputValue('')
      return
    }
    
    const userMessage = inputValue
    setInputValue('')
    
    // Check if this looks like a code generation request
    const codeKeywords = ['create', 'build', 'make', 'generate', 'add', 'component', 'page', 'function', 'api', 'hook']
    const isCodeRequest = codeKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    )
    
    if (isCodeRequest) {
      // Use AI code generation
      await generateCodeWithAI(userMessage)
    } else {
      // Use regular chat
      try {
        addChatMessage('user', userMessage)
        const response = await geminiService.chat(userMessage)
        addChatMessage('assistant', response)
      } catch (error) {
        addChatMessage('assistant', `Sorry, I encountered an error: ${error}`)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      // Set the API key in environment (this would typically be done differently in production)
      localStorage.setItem('VITE_GEMINI_API_KEY', apiKey.trim())
      
      // Reinitialize the service
      window.location.reload() // Simple way to reinitialize - in production you'd do this more elegantly
    }
    setShowApiKeyInput(false)
    setApiKey('')
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatHistory])

  const quickPrompts = [
    "Create a neon button component with hover effects",
    "Build a cyberpunk dashboard with cards", 
    "Make a glowing input field component",
    "Add a loading spinner with neon animations",
    "Create a contact form with validation",
    "Build a pricing table component"
  ]

  const examplePrompts = [
    {
      title: "UI Components",
      prompts: [
        "Create a button with neon glow effect",
        "Make a card component with hover animation",
        "Build a navigation menu with transitions"
      ]
    },
    {
      title: "Full Features", 
      prompts: [
        "Create a contact form with validation",
        "Build a dashboard with charts",
        "Make a user profile page"
      ]
    }
  ]

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="w-80 bg-cyber-gray/40 backdrop-blur-sm border-l border-neon-cyan/30 flex flex-col"
    >
      <div className="h-14 bg-cyber-dark/50 border-b border-neon-cyan/20 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-neon-pink animate-pulse-neon" />
          <span className="text-lg font-cyber font-semibold text-neon-pink">AI Assistant</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isApiAvailable && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowApiKeyInput(true)}
              className="p-1 rounded hover:bg-cyber-light/50 text-yellow-400 hover:text-yellow-300"
              title="Configure API Key"
            >
              <Key className="w-4 h-4" />
            </motion.button>
          )}
          
          <div className={`w-2 h-2 rounded-full ${isApiAvailable ? 'bg-neon-green animate-pulse' : 'bg-yellow-500'}`} />
        </div>
      </div>
      
      {showApiKeyInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-cyber-dark/80 border-b border-neon-cyan/20 p-4"
        >
          <p className="text-sm text-gray-300 mb-3">
            Enter your Gemini API key to enable AI features:
          </p>
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Gemini API key..."
              className="flex-1 input-neon text-xs"
              onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
            />
            <button
              onClick={handleApiKeySubmit}
              className="btn-neon text-xs px-2 py-1"
            >
              Set
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">Google AI Studio</a>
          </p>
        </motion.div>
      )}
      
      <div className="flex-1 flex flex-col">
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-400"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-3"
              >
                🤖
              </motion.div>
              <p className="text-sm mb-1">Hi! I'm your AI coding assistant.</p>
              <p className="text-xs mb-4">I can help you build components, features, and full applications!</p>
              
              {!isApiAvailable && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-yellow-400 mx-auto mb-2" />
                  <p className="text-xs text-yellow-200">
                    Set your Gemini API key to enable AI features
                  </p>
                  <button
                    onClick={() => setShowApiKeyInput(true)}
                    className="mt-2 text-xs text-neon-cyan hover:underline"
                  >
                    Configure API Key
                  </button>
                </motion.div>
              )}
              
              <div className="space-y-4">
                {examplePrompts.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <p className="text-xs text-neon-cyan font-semibold mb-2">{category.title}:</p>
                    <div className="space-y-1">
                      {category.prompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setInputValue(prompt)}
                          className="block w-full text-left p-2 text-xs bg-cyber-dark/50 border border-neon-cyan/20 rounded hover:border-neon-cyan/50 transition-all"
                          disabled={!isApiAvailable}
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            chatHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-neon-cyan/20' : 'bg-neon-pink/20'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-neon-cyan" />
                    ) : (
                      <Bot className="w-4 h-4 text-neon-pink" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-neon-cyan/10 border border-neon-cyan/30' 
                      : 'bg-neon-pink/10 border border-neon-pink/30'
                  }`}>
                    <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-neon-pink/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-neon-pink" />
                </div>
                <div className="p-3 rounded-lg bg-neon-pink/10 border border-neon-pink/30">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-neon-pink rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-neon-pink rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-neon-pink rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-300">Generating code...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="p-4 border-t border-neon-cyan/20">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isApiAvailable ? "Describe what you want to build..." : "Set API key to enable AI..."}
              className="flex-1 input-neon rounded text-sm"
              disabled={isGenerating}
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating || !isApiAvailable}
              className="btn-neon px-3 py-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
          
          {isApiAvailable && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              ⚡ Powered by Google Gemini AI
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatPanel
