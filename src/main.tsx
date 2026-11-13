import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fredoka'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root-element niet gevonden')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)