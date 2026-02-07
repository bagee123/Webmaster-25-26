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

// Welcome alert on page load
window.onload = function () {
  alert("Guest Login Credentials:\nEmail: guestemail@gmail.com\nPassword: Ardvark#1234\n\nNote: You may use your personal email to sign up and login");
};
