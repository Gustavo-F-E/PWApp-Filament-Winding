'use client'

import { createContext, useContext } from 'react'

type AuthContextType = {
  isLogged: boolean
}

// 🔹 Hardcodeado por ahora
const AuthContext = createContext<AuthContextType>({
  isLogged: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isLogged = false // 👈 ACÁ simulás la sesión global

  return (
    <AuthContext.Provider value={{ isLogged }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}