import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { findUserById } from '../data/mockUsers'
import { authenticate, type AuthResult } from '../lib/auth'
import {
  clearSession,
  loadSessionUserId,
  saveSessionUserId,
} from '../lib/storage'
import type { User } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const userId = loadSessionUserId()
    return userId ? (findUserById(userId) ?? null) : null
  })

  const login = useCallback((username: string, password: string): AuthResult => {
    const result = authenticate(username, password)
    if (result.ok) {
      saveSessionUserId(result.value.id)
      setUser(result.value)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
