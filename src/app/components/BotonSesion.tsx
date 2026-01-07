// app/components/BotonSesion.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useIdioma } from "@/context/IdiomaContext"

interface BotonSesionProps {
  onOpenLogin?: () => void
  onOpenRegister?: () => void
}

export default function BotonSesion({ 
  onOpenLogin, 
  onOpenRegister 
}: BotonSesionProps) {
  const { t } = useIdioma()
  const { isLogged, logout } = useAuth()

  const handleOpenRegister = (e: React.MouseEvent) => {
    e.preventDefault()
    onOpenRegister?.()
  }

  if (!isLogged) {
    return (
      <>
        <div className="flex justify-center w-full">
          <button
            onClick={onOpenLogin}
            className="py-[3%] w-[70%] text-fluid-lg mb-2 bg-blue-300 text-blue-950 rounded-full border border-2 border-blue-100 font-bold hover:bg-blue-800 hover:text-blue-50 hover:border hover:text-fluid-xl hover:border-blue-50 transition-all duration-200"
          >
            {t("sesion.iniciar")}
          </button>
        </div>
        <div className="text-center text-blue-50">
          {t("sesion.pregunta")}&nbsp;
          <button
            onClick={handleOpenRegister}
            className="inline underline text-fluid-sm hover:text-blue-100 hover:font-bold transition-colors"
          >
            {t("sesion.registro")}
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={logout}
        className="py-[3%] w-[70%] text-fluid-lg mb-2 bg-red-300 text-red-950 rounded-full font-bold border border-2 border-red-950 hover:bg-red-800 hover:text-red-50 hover:border-red-50 transition-all duration-200"
      >
        {t("sesion.cerrar")}
      </button>
    </div>
  )
}