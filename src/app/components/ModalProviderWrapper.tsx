// app/components/ModalProviderWrapper.tsx
'use client'

import { useState } from 'react'
import BotonSesion from './BotonSesion'
import ModalIniciarSesion from './ModalIniciarSesion'
import ModalRegistro from './ModalRegistro'

export default function ModalProviderWrapper() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const openRegisterModal = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const openLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  return (
    <>
      {/* Botón de sesión que ahora recibe funciones para abrir modales */}
      <BotonSesion 
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />

      {/* Modales */}
      <ModalIniciarSesion 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={openRegisterModal}
      />
      
      <ModalRegistro 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onOpenLogin={openLoginModal}
      />
    </>
  )
}