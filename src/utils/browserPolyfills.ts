// Browser compatibility polyfills using native APIs
// This avoids Vite externalization issues

// Browser-compatible Buffer implementation
class BrowserBuffer {
  static from(data: string, encoding: string = 'utf8'): BrowserBuffer {
    const instance = new BrowserBuffer()
    if (encoding === 'base64') {
      instance.data = data
      return instance
    }
    if (encoding === 'utf8') {
      // Convert UTF-8 string to base64
      instance.data = btoa(unescape(encodeURIComponent(data)))
      return instance
    }
    instance.data = data
    return instance
  }

  private data: string = ''

  toString(encoding: string = 'utf8'): string {
    if (encoding === 'utf8') {
      try {
        // Decode base64 to UTF-8
        return decodeURIComponent(escape(atob(this.data)))
      } catch (error) {
        console.warn('Failed to decode as base64, returning as-is:', error)
        return this.data
      }
    }
    if (encoding === 'base64') {
      return this.data
    }
    return this.data
  }
}

// Enhanced base64 decoding for better Unicode support
function decodeBase64ToUTF8(base64String: string): string {
  try {
    // Method 1: Use native atob with proper UTF-8 handling
    const binaryString = atob(base64String)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder('utf-8').decode(bytes)
  } catch (error) {
    try {
      // Method 2: Fallback to simpler decoding
      return decodeURIComponent(escape(atob(base64String)))
    } catch (fallbackError) {
      console.warn('All base64 decoding methods failed, returning raw:', fallbackError)
      return base64String
    }
  }
}

// Enhanced base64 encoding for better Unicode support
function encodeUTF8ToBase64(utf8String: string): string {
  try {
    // Method 1: Use native btoa with proper UTF-8 handling
    const bytes = new TextEncoder().encode(utf8String)
    const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
    return btoa(binaryString)
  } catch (error) {
    try {
      // Method 2: Fallback to simpler encoding
      return btoa(unescape(encodeURIComponent(utf8String)))
    } catch (fallbackError) {
      console.warn('All base64 encoding methods failed, returning raw:', fallbackError)
      return utf8String
    }
  }
}

// Make Buffer available globally
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.Buffer = BrowserBuffer
  // @ts-ignore
  globalThis.Buffer = BrowserBuffer
}

// Export utilities for direct use
export { BrowserBuffer as Buffer, decodeBase64ToUTF8, encodeUTF8ToBase64 }
