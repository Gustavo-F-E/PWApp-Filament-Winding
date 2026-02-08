// app/components/ModalRegistro.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import ModalPoliticas from './ModalPoliticas'
import { CloseIcon, EyeIcon, EyeOffIcon, GoogleIcon, GithubIcon, TwitterIcon } from './IconosSVG'

interface ModalRegistroProps {
  isOpen: boolean
  onClose: () => void
  onOpenLogin: () => void // Nueva prop
}

export default function ModalRegistro({
  isOpen,
  onClose,
  onOpenLogin
}: ModalRegistroProps) {
  //const { t } = useIdioma()
  const { login } = useAuth()
  const [isPoliticasOpen, setIsPoliticasOpen] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      document.body.style.position = 'relative'
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simular registro y delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Aquí iría la lógica real de registro
      // Por ahora simulamos un registro exitoso
      console.log('Registrando usuario:', {
        username: formData.username,
        email: formData.email
      })

      // Auto-login después del registro exitoso
      login({ email: formData.email, password: formData.password })

      // Cerrar modal después de registro exitoso
      setTimeout(() => {
        onClose()
        resetForm()
      }, 500)

    } catch (error) {
      console.log(`Error ${error}`)
      setErrors({
        general: 'Error al registrar. Intenta nuevamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSocialRegister = (provider: string) => {
    // Simulación de registro con redes sociales
    console.log(`Registro con ${provider}`)
    setIsLoading(true)
    setTimeout(() => {
      login({ email: provider, password: 'oauth' }) // Auto-login después de registro con red social
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
                Crear Cuenta
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

          {/* Formulario de Registro */}
          <form onSubmit={handleSubmit} className="p-6 bg-white">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {/* Campo Nombre de Usuario */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-white-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white-700 ${errors.username ? 'border-red-300' : 'border-white-300'
                  }`}
                placeholder="Ingresa tu nombre de usuario"
                disabled={isLoading}
                autoFocus
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Campo Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white-700 mb-2">
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white-700 ${errors.email ? 'border-red-300' : 'border-white-300'
                  }`}
                placeholder="Ingresa tu email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-white-700 mb-2">
                Ingrese una contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white-700 ${errors.password ? 'border-red-300' : 'border-white-300'
                    }`}
                  placeholder="Crea una contraseña segura"
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white-700 mb-2">
                Reingrese la contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 text-white-700 ${errors.confirmPassword ? 'border-red-300' : 'border-white-300'
                    }`}
                  placeholder="Vuelve a escribir tu contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-500 hover:text-white-700 p-1"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Botón de Registro */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                transition-all duration-200 mb-6
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
                  Creando cuenta...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>

            {/* Separador con texto "Registrarse con:" */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex-grow border-t border-white-300"></div>
                <span className="mx-4 text-sm text-white-500">
                  Registrarse con:
                </span>
                <div className="flex-grow border-t border-white-300"></div>
              </div>
            </div>

            {/* Botones de Redes Sociales */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                type="button"
                onClick={() => handleSocialRegister('google')}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                aria-label="Registrarse con Google"
              >
                <GoogleIcon className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialRegister('github')}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                aria-label="Registrarse con GitHub"
              >
                <GithubIcon className="w-6 h-6" colorClass="#181717" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialRegister('twitter')}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-white-300 flex items-center justify-center hover:bg-white-50 transition-colors disabled:opacity-50"
                aria-label="Registrarse con Twitter"
              >
                <TwitterIcon className="w-6 h-6" />
              </button>
            </div>

            {/* ENLACE PARA INICIAR SESIÓN - MODIFICADO */}
            <div className="text-center text-sm text-white-600">
              <span>¿Ya tienes una cuenta? </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                onClick={() => {
                  onClose()
                  onOpenLogin() // Abre el modal de inicio de sesión
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Footer del Modal */}
          <div className="border-t border-white-200 p-4 bg-white-50 rounded-b-xl">
            <div className="text-center text-xs text-white-500">
              Al registrarte, aceptas nuestros {' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => setIsPoliticasOpen(true)}
              >
                Términos de Servicio y Política de Privacidad
              </button>
            </div>
            {/* Añade el modal de políticas al final del componente */}
            <ModalPoliticas
              isOpen={isPoliticasOpen}
              onClose={() => setIsPoliticasOpen(false)}
              showAcceptButton={true}
              onAccept={() => {
                // Lógica cuando el usuario acepta los términos
                console.log('Usuario aceptó los términos')
              }}
            />
          </div>

        </div>
      </div>
    </>
  )
}