// app/components/OrientationHandler.tsx
'use client'

import { useEffect } from 'react'

export default function OrientationHandler() {
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches
      
      // Disparar evento personalizado para el contexto
      window.dispatchEvent(new CustomEvent('pwa-orientation-change', {
        detail: { isLandscape }
      }))
      
      // También el evento original por compatibilidad
      window.dispatchEvent(new CustomEvent('orientationchanged', {
        detail: { isLandscape }
      }))
    }

    // Verificar orientación inicial
    checkOrientation()

    // Listeners para cambios
    window.addEventListener('orientationchange', checkOrientation)
    window.addEventListener('resize', checkOrientation)

    return () => {
      window.removeEventListener('orientationchange', checkOrientation)
      window.removeEventListener('resize', checkOrientation)
    }
  }, [])

  return null
}