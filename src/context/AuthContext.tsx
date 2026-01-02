// context/AuthContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  isLogged: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false) // 👈 Estado para simular sesión

  const login = () => {
    setIsLogged(true)
    // Aquí podrías agregar lógica real de login
  }

  const logout = () => {
    setIsLogged(false)
    // Aquí podrías agregar lógica real de logout
  }

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}