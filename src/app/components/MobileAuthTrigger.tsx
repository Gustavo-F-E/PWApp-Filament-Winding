// app/components/MobileAuthTrigger.tsx
'use client'

import { useState, useEffect } from 'react'
import { useMobile } from '@/context/MobileContext'
import ModalIniciarSesion from './ModalIniciarSesion'
import ModalRegistro from './ModalRegistro'
import { LoginIcon, UserPlusIcon } from './IconosSVG'

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
            <LoginIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl"
            aria-label="Registrarse"
          >
            <UserPlusIcon className="w-6 h-6" />
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