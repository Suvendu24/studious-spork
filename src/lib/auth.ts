import { findUserByUsername, mockCredentials } from '../data/mockUsers'
import type { User } from '../types'

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'MISSING_FIELDS'
  message: string
}

export type AuthResult =
  | { ok: true; value: User }
  | { ok: false; error: AuthError }

/**
 * Mock, frontend-only credential check against the demo credential list.
 * There is no backend, hashing, token or session server behind this.
 */
export function authenticate(username: string, password: string): AuthResult {
  if (username.trim() === '' || password === '') {
    return {
      ok: false,
      error: { code: 'MISSING_FIELDS', message: 'Enter a username and password.' },
    }
  }

  const credential = mockCredentials.find(
    (entry) => entry.username === username.trim().toLowerCase(),
  )
  const user = findUserByUsername(username)

  if (!credential || !user || credential.password !== password) {
    return {
      ok: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password.',
      },
    }
  }

  return { ok: true, value: user }
}
