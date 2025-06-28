/// <reference types="vite/client" />

// Custom Buffer interface for browser compatibility
interface BrowserBuffer {
  toString(encoding?: string): string
}

// Extend Window interface to include our custom Buffer
declare global {
  interface Window {
    Buffer: {
      from(data: string, encoding?: string): BrowserBuffer
    }
  }
  
  // Extend globalThis as well
  var Buffer: {
    from(data: string, encoding?: string): BrowserBuffer
  }
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
