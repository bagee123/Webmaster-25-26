import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'
import './css/index.css'
import './css/darkMode.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DarkModeProvider>
  </StrictMode>
)

// Register service worker for offline support and caching
if (import.meta.env.PROD) {
  registerServiceWorker();
}
