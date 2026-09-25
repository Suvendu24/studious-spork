import type { Account, Transaction } from '../types'

export const STORAGE_KEY = 'savings-app.account.v1'

export function loadAccount(fallback: Account): Account {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return fallback
    }
    const parsed: unknown = JSON.parse(raw)
    return isAccount(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveAccount(account: Account): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
  } catch {
    // Storage can be unavailable (private mode, quota). The app still works
    // in memory, so persistence failures are not surfaced to the user.
  }
}

export function clearAccount(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // See saveAccount.
  }
}

function isAccount(value: unknown): value is Account {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Partial<Account>
  return (
    typeof candidate.id === 'string' &&
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
    (candidate.type === 'deposit' || candidate.type === 'withdrawal') &&
    typeof candidate.amountInCents === 'number' &&
    typeof candidate.balanceAfterInCents === 'number' &&
    typeof candidate.description === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}
