import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import { completeAppBoot, isBuilderRoute } from './bootLoader.js'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element was not found')
}

createRoot(root).render(
  <StrictMode>
    {isBuilderRoute ? <App /> : <LandingPage />}
  </StrictMode>,
)

if (!isBuilderRoute) {
  completeAppBoot()
}
