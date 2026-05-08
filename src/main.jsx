import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'

const isBuilderRoute = window.location.pathname.startsWith('/app')
const seoFallback = document.getElementById('seo-static-fallback')
if (seoFallback) {
  seoFallback.remove()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isBuilderRoute ? <App /> : <LandingPage />}
  </StrictMode>,
)
