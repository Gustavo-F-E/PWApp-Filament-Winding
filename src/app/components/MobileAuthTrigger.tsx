// app/components/MobileAuthTrigger.tsx
'use client'

import { useState, useEffect } from 'react'
import { useMobile } from '@/context/MobileContext'
import ModalIniciarSesion from './ModalIniciarSesion'
import ModalRegistro from './ModalRegistro'

export default function MobileAuthTrigger() {
  const { isMobile } = useMobile()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  
  // Botón flotante para móviles
  if (!isMobile) return null
  
  return (
    <>
      {/* Botón flotante para móviles */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl"
            aria-label="Iniciar sesión"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>
          
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl"
            aria-label="Registrarse"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Modales */}
      <ModalIniciarSesion 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }}
      />
      
      <ModalRegistro 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onOpenLogin={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </>
  )
}