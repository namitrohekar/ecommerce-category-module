import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import Lenis from 'lenis'

// Initialise Lenis smooth scroll once, globally
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  return lenis
}

initLenis()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <Toaster position='top-right' richColors />
    </>
  </StrictMode>,
)
