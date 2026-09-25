import { createContext, useContext } from 'react'
import type { AuthResult } from '../lib/auth'
import type { User } from '../types'

export interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => AuthResult
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.')
  }
  return context
}
