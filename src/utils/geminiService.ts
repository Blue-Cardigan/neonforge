import { GoogleGenerativeAI } from '@google/generative-ai'

interface GenerateCodeOptions {
  prompt: string
  projectContext?: string
  currentFiles?: Record<string, string>
}

interface GeneratedCode {
  explanation: string
  files: Array<{
    path: string
    content: string
    language: string
  }>
  dependencies?: string[]
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  constructor() {
    this.initialize()
  }

  private initialize() {
    // Try to get API key from environment first, then localStorage
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                   (typeof window !== 'undefined' ? localStorage.getItem('VITE_GEMINI_API_KEY') : null)
    
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    } else {
      console.warn('Gemini API key not found. Set VITE_GEMINI_API_KEY in your environment or configure it in the app.')
    }
  }

  async generateCode(options: GenerateCodeOptions): Promise<GeneratedCode> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.')
    }

    const systemPrompt = `You are an expert full-stack developer and AI assistant for NeonForge, a cyberpunk-themed code generation platform. You help users build modern web applications with React, TypeScript, and cutting-edge technologies.

IMPORTANT INSTRUCTIONS:
1. Always respond with valid JSON in this exact format:
{
  "explanation": "Brief explanation of what you're creating",
  "files": [
    {
      "path": "relative/path/to/file.tsx",
      "content": "complete file content here",
      "language": "typescript"
    }
  ],
  "dependencies": ["optional array of npm packages to install"]
}

2. Generate complete, working code files
3. Use modern React patterns (hooks, functional components)
4. Include TypeScript types and interfaces
5. Apply cyberpunk/neon styling when creating UI components
6. Use Tailwind CSS classes for styling
7. Include proper imports and exports
8. Make code production-ready and well-commented

Current project context:
- React 18 + TypeScript + Vite
- Tailwind CSS with cyberpunk theme
- Framer Motion for animations
- Available colors: neon-cyan (#00ffff), neon-pink (#ff00ff), neon-green (#00ff00)

Existing files context:
${JSON.stringify(options.currentFiles, null, 2)}
`

    const userPrompt = `${systemPrompt}

User Request: ${options.prompt}

Please generate the appropriate code files for this request. Make sure the response is valid JSON.`

    try {
      const result = await this.model.generateContent(userPrompt)
      const response = await result.response
      const text = response.text()
      
      // Try to extract JSON from the response
      let jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        // If no JSON found, wrap the response as explanation
        return {
          explanation: text,
          files: [],
          dependencies: []
        }
      }

      try {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          explanation: parsed.explanation || 'Code generated successfully',
          files: parsed.files || [],
          dependencies: parsed.dependencies || []
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError)
        return {
          explanation: text,
          files: [],
          dependencies: []
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate code. Please try again.')
    }
  }

  async chat(message: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.')
    }

    const systemPrompt = `You are a helpful AI assistant for NeonForge, a cyberpunk-themed code generation platform. You help developers with coding questions, provide explanations, and offer guidance. Keep responses concise but helpful. Use a friendly, professional tone with occasional cyberpunk flair (but don't overdo it).`

    try {
      const result = await this.model.generateContent(`${systemPrompt}\n\nUser: ${message}`)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini chat error:', error)
      throw new Error('Failed to get response. Please try again.')
    }
  }

  isAvailable(): boolean {
    return this.model !== null
  }
  
  reinitialize(): void {
    this.initialize()
  }
}

export const geminiService = new GeminiService()
export type { GenerateCodeOptions, GeneratedCode }
