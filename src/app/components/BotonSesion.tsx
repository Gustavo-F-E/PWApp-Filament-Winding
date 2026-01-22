'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useIdioma } from '@/context/IdiomaContext'

export default function BotonSesion() {
  const { t } = useIdioma()
  const { isLogged, logout } = useAuth()

  if (!isLogged) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Link
          href="/sesion"
          key="login-link"
          className="py-3 w-[60%] text-fluid-lg mb-2 bg-blue-300 text-blue-950 rounded-full font-bold text-center block hover:bg-blue-200 transition-colors"
        >
          {t("sesion.iniciar")}
        </Link>

        <div className="text-center text-blue-50 mt-2">
          {t("sesion.pregunta")}{' '}
          <Link 
            href="/registro" 
            key="register-link"
            className="underline font-bold hover:text-blue-200 transition-colors"
          >
            {t("sesion.registro")}
          </Link>
        </div>
      </div>
    )
  }

  return (
      <div className="flex items-center justify-center">
          <button
              onClick={logout}
              className="py-[3%] w-[70%] text-fluid-lg bg-red-50 text-red-900 rounded-full font-bold border-2 border-red-900 hover:bg-red-900 hover:text-red-50 transition-colors duration-200"
          >
              {t("sesion.cerrar")}
          </button>
      </div>
  );
}
