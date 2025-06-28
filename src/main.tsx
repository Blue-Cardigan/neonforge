import React from 'react'
import ReactDOM from 'react-dom/client'
import './utils/browserPolyfills' // Import polyfills first
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
