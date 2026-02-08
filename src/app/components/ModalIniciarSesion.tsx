// app/components/ModalInicioDeSesion.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useIdioma } from '@/context/IdiomaContext'
import { CloseIcon, EyeIcon, EyeOffIcon, GoogleIcon, GithubIcon, TwitterIcon } from './IconosSVG'

interface ModalIniciarSesionProps {
  isOpen: boolean
  onClose: () => void
  onOpenRegister: () => void // Nueva prop
}

export default function ModalIniciarSesion({
  isOpen,
  onClose,
  onOpenRegister
}: ModalIniciarSesionProps) {
  const { t } = useIdioma()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Cerrar modal con Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.")
      return
    }

    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      await login({ email: username, password })

      setTimeout(() => {
        onClose()
        resetForm()
      }, 300)

    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setShowPassword(false)
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)
    setTimeout(() => {
      login({ email: provider, password: 'oauth' })
      setIsLoading(false)
      onClose()
      resetForm()
    }, 800)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal */}
        <div
          className="
            bg-white rounded-xl shadow-2xl w-full max-w-md 
            max-h-[90vh] overflow-y-auto relative
            
          "
          style={{
            backgroundColor: 'white',
            backgroundImage: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white border-b border-white-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white-900">
                {t("sesion.iniciar")}
              </h2>
              <button
                onClick={handleClose}
                className="text-white-400 hover:text-white-600 transition-colors p-1"
                aria-label="Cerrar modal"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Campo Usuario */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-white-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white-700"
                placeholder="Ingresa tu nombre de usuario"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Campo Contraseña */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-white-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white-700"
                  placeholder="Ingresa tu contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-500 hover:text-white-700 p-1"
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={() => {/* Lógica para recuperar contraseña */ }}
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            {/* Botón de Inicio de Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                transition-all duration-200 mb-4
                ${isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                t("sesion.iniciar")
              )}
            </button>

            {/* Separador */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-white-300"></div>
              <span className="mx-4 text-sm text-white-500">
                O ingresa con
              </span>
              <div className="flex-grow border-t border-white-300"></div>
            </div>

            {/* Botones de Redes Sociales */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                aria-label="Iniciar sesión con Google"
              >
                <GoogleIcon className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                aria-label="Iniciar sesión con GitHub"
              >
                <GithubIcon className="w-6 h-6" colorClass="#181717" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('twitter')}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                aria-label="Iniciar sesión con Twitter"
              >
                <TwitterIcon className="w-6 h-6" />
              </button>
            </div>

            {/* ENLACE DE REGISTRO - MODIFICADO */}
            <div className="text-center text-sm text-white-600">
              <span>{t("sesion.pregunta")} </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  onOpenRegister() // Abre el modal de registro
                }}
              >
                {t("sesion.registro")}
              </button>
            </div>
          </form>

          {/* Footer del Modal */}
          <div className="border-t border-white-200 p-4 bg-white-50 rounded-b-xl">
            <div className="text-center text-xs text-white-500">
              Demo: Cualquier credencial funcionará. La autenticación real se implementará más adelante.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}