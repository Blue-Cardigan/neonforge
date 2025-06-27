import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus, Code, Sparkles, Rocket, FileText } from 'lucide-react'
import { useAppStore } from '../store'
import { projectTemplates } from '../templates/projectTemplates'

const WelcomeScreen: React.FC = () => {
  const { setShowNewProjectModal, generateCodeWithAI } = useAppStore()

  const quickStartActions = [
    {
      icon: <Plus className="w-6 h-6" />,
      title: "Create New Project",
      description: "Start with a pre-built template",
      action: () => setShowNewProjectModal(true),
      color: "neon-pink"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Generate with AI",
      description: "Describe what you want to build",
      action: () => generateCodeWithAI("Create a modern React dashboard with cyberpunk styling"),
      color: "neon-cyan"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Start Coding",
      description: "Jump into the editor",
      action: () => setShowNewProjectModal(true),
      color: "neon-green"
    }
  ]

  const popularTemplates = projectTemplates.slice(0, 3)

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            ⚡
          </motion.div>
          
          <h1 className="text-5xl font-cyber font-bold mb-4">
            <span className="text-neon-cyan">Welcome to </span>
            <span className="text-neon-pink">NeonForge</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The cyberpunk-themed AI-powered development platform. 
            Build modern applications with the power of artificial intelligence.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewProjectModal(true)}
            className="btn-neon border-neon-pink text-neon-pink hover:bg-neon-pink text-lg px-8 py-4"
          >
            <Rocket className="w-5 h-5 inline mr-2" />
            Start Building
          </motion.button>
        </motion.div>

        {/* Quick Start Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-cyber font-semibold text-center mb-8 text-neon-cyan">
            Quick Start
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {quickStartActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="cursor-pointer"
                onClick={action.action}
              >
                <div className={`bg-cyber-gray/30 p-6 rounded-lg border border-${action.color}/30 hover:border-${action.color}/60 transition-all group`}>
                  <div className={`text-${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-2xl font-cyber font-semibold text-center mb-8 text-neon-green">
            Popular Templates
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {popularTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setShowNewProjectModal(true)}
              >
                <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-green/30 hover:border-neon-green/60 transition-all group">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-neon-green transition-colors">
                        {template.name}
                      </h3>
                      <span className="text-xs text-neon-pink font-medium">{template.category}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-2 py-1 bg-cyber-light/50 text-xs text-gray-300 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-cyber font-semibold mb-8 text-white">
            Why Choose NeonForge?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "🤖", title: "AI-Powered", desc: "Generate code with natural language" },
              { icon: "⚡", title: "Lightning Fast", desc: "WebContainer for instant preview" },
              { icon: "🎨", title: "Cyberpunk UI", desc: "Stunning neon-themed interface" },
              { icon: "🔥", title: "Hot Reload", desc: "See changes in real-time" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WelcomeScreen
