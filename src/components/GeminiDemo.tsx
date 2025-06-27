import React from 'react'

const GeminiDemo: React.FC = () => {
  return (
    <div className="p-8 bg-cyber-dark text-white min-h-screen">
      <h1 className="text-3xl font-cyber font-bold text-neon-cyan mb-6">
        🤖 Gemini AI Integration Demo
      </h1>
      
      <div className="space-y-4 max-w-4xl">
        <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-cyan/30">
          <h2 className="text-xl font-semibold text-neon-pink mb-4">Example AI Prompts</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-neon-cyan font-semibold">🔧 Component Generation</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• "Create a neon button component with hover effects"</li>
                <li>• "Build a cyberpunk card with glowing borders"</li>
                <li>• "Make a loading spinner with neon animations"</li>
                <li>• "Create a contact form with validation"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-neon-pink font-semibold">🏗️ Full Applications</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• "Build a dashboard with charts and metrics"</li>
                <li>• "Create a todo app with drag and drop"</li>
                <li>• "Make a portfolio website with animations"</li>
                <li>• "Build a landing page for a tech startup"</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-pink/30">
          <h2 className="text-xl font-semibold text-neon-green mb-4">How It Works</h2>
          
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start space-x-3">
              <span className="text-neon-cyan">1.</span>
              <p>Type your request in natural language</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-neon-cyan">2.</span>
              <p>Gemini AI analyzes your request and current project context</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-neon-cyan">3.</span>
              <p>AI generates complete, working React components with TypeScript</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-neon-cyan">4.</span>
              <p>Files are automatically created and synced with WebContainer</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-neon-cyan">5.</span>
              <p>See your generated code running instantly in the preview</p>
            </div>
          </div>
        </div>
        
        <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-green/30">
          <h2 className="text-xl font-semibold text-neon-cyan mb-4">AI Features</h2>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="text-neon-pink font-semibold mb-2">🧠 Smart Context</h4>
              <p className="text-gray-300">AI understands your existing code and maintains consistency</p>
            </div>
            <div>
              <h4 className="text-neon-green font-semibold mb-2">⚡ Real-time Generation</h4>
              <p className="text-gray-300">Code appears instantly with live preview updates</p>
            </div>
            <div>
              <h4 className="text-neon-cyan font-semibold mb-2">🎨 Style Aware</h4>
              <p className="text-gray-300">Automatically applies cyberpunk theme and best practices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeminiDemo
