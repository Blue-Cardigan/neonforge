export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  features: string[]
  files: Record<string, string>
  dependencies: string[]
  devDependencies: string[]
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'react-typescript',
    name: 'React + TypeScript',
    description: 'Modern React app with TypeScript, Tailwind CSS, and cyberpunk styling',
    category: 'Frontend',
    icon: '⚛️',
    features: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Hot Reload'],
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@types/react', '@types/react-dom', '@vitejs/plugin-react', 'typescript', 'vite', 'tailwindcss', 'autoprefixer', 'postcss'],
    files: {
      'package.json': `{
  "name": "neon-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}`,
      'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
      'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          green: '#00ff00',
          purple: '#8b00ff',
          blue: '#0080ff',
        },
        cyber: {
          dark: '#0a0a0f',
          darker: '#05050a',
          gray: '#1a1a2e',
          light: '#16213e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        cyber: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '100%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
    },
  },
  plugins: [],
}`,
      'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Neon Project</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-cyber-darker">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      'src/App.tsx': `import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-cyber-darker text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-cyber font-bold text-neon-cyan mb-4 animate-pulse-neon">
          🚀 Welcome to NeonForge
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your cyberpunk-themed React application is ready! Start building something amazing.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-cyan/30">
            <h2 className="text-xl font-semibold text-neon-pink mb-3">⚡ Quick Start</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Edit <code className="text-neon-cyan">src/App.tsx</code> to start coding</li>
              <li>• Use the AI assistant to generate components</li>
              <li>• Customize your cyberpunk theme in Tailwind config</li>
            </ul>
          </div>
          
          <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-green/30">
            <h2 className="text-xl font-semibold text-neon-green mb-3">🎨 Styling</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Neon colors: <span className="text-neon-cyan">cyan</span>, <span className="text-neon-pink">pink</span>, <span className="text-neon-green">green</span></li>
              <li>• Custom fonts: Orbitron & JetBrains Mono</li>
              <li>• Built-in glow animations and effects</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="bg-transparent border-2 border-neon-cyan text-neon-cyan px-6 py-3 font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-neon-cyan hover:text-cyber-dark hover:shadow-lg">
            Start Building
          </button>
        </div>
      </div>
    </div>
  )
}

export default App`,
      'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cyber-darker text-white font-mono;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
  }
}

@layer components {
  .btn-neon {
    @apply px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan 
           font-semibold uppercase tracking-wider transition-all duration-300
           hover:bg-neon-cyan hover:text-cyber-dark hover:shadow-lg;
    text-shadow: 0 0 5px currentColor;
    box-shadow: 0 0 5px currentColor;
  }
}`,
      'public/vite.svg': `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`
    }
  },
  
  {
    id: 'next-fullstack',
    name: 'Next.js Full-Stack',
    description: 'Complete Next.js application with API routes, database, and authentication',
    category: 'Full-Stack',
    icon: '🔗',
    features: ['Next.js 14', 'TypeScript', 'API Routes', 'Tailwind CSS', 'App Router'],
    dependencies: ['next', 'react', 'react-dom'],
    devDependencies: ['@types/react', '@types/react-dom', '@types/node', 'typescript', 'tailwindcss', 'autoprefixer', 'postcss'],
    files: {
      'package.json': `{
  "name": "neon-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.3"
  }
}`,
      'next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

export default nextConfig`,
      'tailwind.config.ts': `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          green: '#00ff00',
          purple: '#8b00ff',
          blue: '#0080ff',
        },
        cyber: {
          dark: '#0a0a0f',
          darker: '#05050a',
          gray: '#1a1a2e',
          light: '#16213e',
        }
      },
    },
  },
  plugins: [],
}
export default config`,
      'tsconfig.json': `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
      'src/app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neon Next.js App',
  description: 'Cyberpunk-themed Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
      'src/app/page.tsx': `export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-darker text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neon-cyan mb-4">
          🔗 Next.js + NeonForge
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Full-stack Next.js application with cyberpunk styling
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-cyan/30">
            <h2 className="text-xl font-semibold text-neon-pink mb-3">🚀 Features</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Next.js 14 with App Router</li>
              <li>• TypeScript support</li>
              <li>• API routes ready</li>
              <li>• Cyberpunk Tailwind theme</li>
            </ul>
          </div>
          
          <div className="bg-cyber-gray/30 p-6 rounded-lg border border-neon-green/30">
            <h2 className="text-xl font-semibold text-neon-green mb-3">📁 Structure</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• <code>src/app/</code> - App Router pages</li>
              <li>• <code>src/components/</code> - Reusable components</li>
              <li>• <code>src/app/api/</code> - API routes</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}`,
      'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cyber-darker text-white;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
  }
}`,
      'src/app/api/hello/route.ts': `import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Hello from NeonForge API!',
    timestamp: new Date().toISOString(),
  })
}`
    }
  },

  {
    id: 'component-library',
    name: 'Component Library',
    description: 'Reusable React component library with Storybook and cyberpunk theme',
    category: 'Library',
    icon: '📦',
    features: ['Storybook', 'Component Library', 'TypeScript', 'Rollup', 'Testing'],
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@types/react', '@types/react-dom', 'typescript', 'rollup', '@storybook/react'],
    files: {
      'package.json': `{
  "name": "neon-ui-library",
  "version": "1.0.0",
  "description": "Cyberpunk-themed React component library",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.3",
    "rollup": "^3.29.4"
  }
}`,
      'src/index.ts': `export { default as NeonButton } from './components/NeonButton'
export { default as NeonCard } from './components/NeonCard'
export { default as NeonInput } from './components/NeonInput'

export * from './types'`,
      'src/types/index.ts': `export interface NeonTheme {
  colors: {
    cyan: string
    pink: string
    green: string
    purple: string
    blue: string
  }
  spacing: {
    sm: string
    md: string
    lg: string
  }
}

export interface BaseProps {
  className?: string
  children?: React.ReactNode
}`,
      'src/components/NeonButton/index.tsx': `import React from 'react'
import { BaseProps } from '../../types'

interface NeonButtonProps extends BaseProps {
  variant?: 'cyan' | 'pink' | 'green'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'font-semibold uppercase tracking-wider transition-all duration-300 border-2'
  
  const variantClasses = {
    cyan: 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black',
    pink: 'border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-black',
    green: 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      style={{
        textShadow: '0 0 5px currentColor',
        boxShadow: '0 0 5px currentColor',
      }}
    >
      {children}
    </button>
  )
}

export default NeonButton`
    }
  },

  {
    id: 'dashboard',
    name: 'Cyberpunk Dashboard',
    description: 'Modern dashboard with charts, metrics, and real-time data visualization',
    category: 'Application',
    icon: '📊',
    features: ['Charts', 'Real-time Data', 'Responsive Design', 'Dark Theme', 'Animations'],
    dependencies: ['react', 'react-dom', 'recharts', 'framer-motion'],
    devDependencies: ['@types/react', '@types/react-dom', '@vitejs/plugin-react', 'typescript', 'vite', 'tailwindcss'],
    files: {
      'src/App.tsx': `import React from 'react'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-cyber-darker">
      <Dashboard />
    </div>
  )
}

export default App`,
      'src/components/Dashboard.tsx': `import React from 'react'
import MetricCard from './MetricCard'
import ChartCard from './ChartCard'

const Dashboard: React.FC = () => {
  const metrics = [
    { title: 'Total Users', value: '24,531', change: '+12%', color: 'cyan' },
    { title: 'Revenue', value: '$89,432', change: '+8%', color: 'green' },
    { title: 'Orders', value: '1,429', change: '+23%', color: 'pink' },
    { title: 'Conversion', value: '3.2%', change: '+0.5%', color: 'purple' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-neon-cyan mb-8">
        🚀 Cyberpunk Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard />
        <ChartCard />
      </div>
    </div>
  )
}

export default Dashboard`
    }
  }
]
