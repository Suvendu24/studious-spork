import type { Account, AccountsById, Transaction } from '../types'

export const ACCOUNTS_STORAGE_KEY = 'savings-app.accounts.v2'
export const SESSION_STORAGE_KEY = 'savings-app.session.v1'

export function loadAccounts(fallback: AccountsById): AccountsById {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY)
    if (!raw) {
      return fallback
    }
    const parsed: unknown = JSON.parse(raw)
    return isAccountsById(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveAccounts(accounts: AccountsById): void {
  try {
    window.localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts),
    )
  } catch {
    // Storage can be unavailable (private mode, quota). The app still works
    // in memory, so persistence failures are not surfaced to the user.
  }
}

export function clearAccounts(): void {
  try {
    window.localStorage.removeItem(ACCOUNTS_STORAGE_KEY)
  } catch {
    // See saveAccounts.
  }
}

export function loadSessionUserId(): string | null {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveSessionUserId(userId: string): void {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, userId)
  } catch {
    // See saveAccounts.
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // See saveAccounts.
  }
}

function isAccountsById(value: unknown): value is AccountsById {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const entries = Object.values(value as Record<string, unknown>)
  return entries.length > 0 && entries.every(isAccount)
}

function isAccount(value: unknown): value is Account {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Partial<Account>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.userId === 'string' &&
    typeof candidate.accountNumber === 'string' &&
    typeof candidate.accountHolder === 'string' &&
    typeof candidate.currency === 'string' &&
    typeof candidate.interestRate === 'number' &&
    typeof candidate.openedAt === 'string' &&
    typeof candidate.balanceInCents === 'number' &&
    Array.isArray(candidate.transactions) &&
    candidate.transactions.every(isTransaction)
  )
}

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Partial<Transaction>
  return (
    typeof candidate.id === 'string' &&
    (candidate.type === 'deposit' ||
      candidate.type === 'withdrawal' ||
      candidate.type === 'transfer-in' ||
      candidate.type === 'transfer-out') &&
    typeof candidate.amountInCents === 'number' &&
    typeof candidate.balanceAfterInCents === 'number' &&
    typeof candidate.description === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}
