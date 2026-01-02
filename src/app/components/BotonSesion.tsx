// components/SessionButton.tsx
'use client'

import { useAuth } from '@/context/AuthContext'

export default function SessionButton() {
  const { isLogged, login, logout } = useAuth()

  if (!isLogged) {
    return (
      <>
        <div className="flex justify-center w-full">
          <button 
            onClick={login}
            className="py-4 w-[70%] text-lg mb-2 bg-blue-300 text-blue-950 rounded-full border border-2 border-blue-100 font-bold hover:bg-blue-800 hover:text-blue-50 hover:border hover:text-xl hover:border-blue-50 transition-all duration-200"
          >
            Iniciar Sesión
          </button>
        </div>
        <div className='text-center text-blue-50'>
          ¿No tienes cuenta?&nbsp;
          <a href="/registrarse" className="inline underline text-sm hover:text-blue-100 hover:font-bold transition-colors">
            Regístrate
          </a>
        </div>
      </>
    )
  }

  return (
    <div className="flex justify-center w-full">
      <button 
        onClick={logout}
        className="py-4 w-[70%] text-lg mb-2 bg-red-300 text-red-950 rounded-full font-bold border border-2 border-red-950 hover:bg-red-800 hover:text-red-50 hover:border-red-50 transition-all duration-200"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}