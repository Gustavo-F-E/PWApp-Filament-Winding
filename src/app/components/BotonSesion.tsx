'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useIdioma } from '@/context/IdiomaContext'

export default function BotonSesion() {
  const { t } = useIdioma()
  const { isLogged, logout, deleteAccount } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
    <div className="flex flex-col items-center justify-center w-full">
      <button
        onClick={logout}
        className="py-3 w-[70%] text-fluid-lg bg-red-50 text-red-900 rounded-full font-bold border-2 border-red-900 hover:bg-red-900 hover:text-red-50 transition-colors duration-200"
      >
        {t("sesion.cerrar")}
      </button>

      <button
        onClick={() => setShowDeleteModal(true)}
        className="mt-4 text-red-600 text-sm underline hover:text-red-800 transition-colors"
      >
        {t("sesion.borrarCuenta")}
      </button>

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4">
              {t("sesion.confirmarBorrarTitulo")}
            </h2>
            <p className="text-gray-700 mb-6">
              {t("sesion.confirmarBorrarTexto")}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  try {
                    await deleteAccount();
                    setShowDeleteModal(false);
                  } catch (err) {
                    alert("Error al eliminar la cuenta");
                  }
                }}
                className="py-3 w-full bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
              >
                {t("sesion.botonConfirmarBorrar")}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3 w-full bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                {t("sesion.botonCancelarBorrar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
