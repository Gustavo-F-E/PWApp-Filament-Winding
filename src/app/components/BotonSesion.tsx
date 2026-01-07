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
          className="py-[3%] w-[70%] text-fluid-lg mb-2 bg-blue-300 text-blue-950 rounded-full font-bold text-center block"
        >
          {t("sesion.iniciar")}
        </Link>

        <div className="text-center text-blue-50">
          {t("sesion.pregunta")}{' '}
          <Link href="/registro" className="underline">
            {t("sesion.registro")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={logout}
      className="py-[3%] w-[70%] text-fluid-lg bg-red-300 text-red-950 rounded-full font-bold"
    >
      {t("sesion.cerrar")}
    </button>
  )
}
