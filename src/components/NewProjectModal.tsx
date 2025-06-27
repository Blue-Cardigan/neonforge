import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Folder, Zap, CheckCircle } from 'lucide-react'
import { projectTemplates, type ProjectTemplate } from '../templates/projectTemplates'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (template: ProjectTemplate, projectName: string) => void
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [projectName, setProjectName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(projectTemplates.map(t => t.category)))]

  const filteredTemplates = projectTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateProject = () => {
    if (selectedTemplate && projectName.trim()) {
      onCreateProject(selectedTemplate, projectName.trim())
      onClose()
      // Reset form
      setSelectedTemplate(null)
      setProjectName('')
      setSearchTerm('')
      setSelectedCategory('All')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-cyber-dark border border-neon-cyan/30 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neon-cyan/20">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-neon-cyan animate-pulse-neon" />
                <h2 className="text-2xl font-cyber font-bold text-white">Create New Project</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cyber-light/50 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex h-[calc(90vh-140px)]">
              {/* Left Panel - Template Selection */}
              <div className="w-2/3 p-6 border-r border-neon-cyan/20">
                {/* Search and Filters */}
                <div className="mb-6">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-cyber-gray/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-neon-cyan text-cyber-dark'
                            : 'bg-cyber-gray/50 text-gray-300 hover:bg-cyber-light/50'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100%-120px)] pr-2">
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-neon-cyan bg-neon-cyan/10'
                          : 'border-neon-cyan/20 bg-cyber-gray/30 hover:border-neon-cyan/50 hover:bg-cyber-gray/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h3 className="font-semibold text-white">{template.name}</h3>
                            <span className="text-xs text-neon-pink font-medium">{template.category}</span>
                          </div>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle className="w-5 h-5 text-neon-cyan" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-cyber-light/50 text-xs text-gray-300 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-400">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Project Configuration */}
              <div className="w-1/3 p-6">
                <h3 className="text-lg font-semibold text-neon-pink mb-4">Project Configuration</h3>
                
                {selectedTemplate ? (
                  <div className="space-y-6">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Name
                      </label>
                      <div className="relative">
                        <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="my-awesome-project"
                          className="w-full pl-10 pr-4 py-2 bg-cyber-gray/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50"
                        />
                      </div>
                    </div>

                    {/* Template Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Template Details</h4>
                      <div className="bg-cyber-gray/30 p-4 rounded-lg border border-neon-cyan/20">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xl">{selectedTemplate.icon}</span>
                          <span className="font-semibold text-white">{selectedTemplate.name}</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{selectedTemplate.description}</p>
                        
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-neon-cyan uppercase tracking-wider">Features</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedTemplate.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-cyber-light/50 text-xs text-gray-300 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dependencies */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Dependencies</h4>
                      <div className="bg-cyber-gray/30 p-3 rounded-lg border border-neon-cyan/20 max-h-32 overflow-y-auto">
                        <div className="text-xs space-y-1">
                          {selectedTemplate.dependencies.map((dep, index) => (
                            <div key={index} className="text-neon-green">📦 {dep}</div>
                          ))}
                          {selectedTemplate.devDependencies.map((dep, index) => (
                            <div key={index} className="text-gray-400">🔧 {dep}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Create Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateProject}
                      disabled={!projectName.trim()}
                      className="w-full btn-neon py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-4 h-4 inline mr-2" />
                      Create Project
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 mt-8">
                    <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a template to configure your project</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NewProjectModal
