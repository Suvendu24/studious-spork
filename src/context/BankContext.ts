import { createContext, useContext } from 'react'
import type { Result } from '../lib/account'
import type { AccountsById } from '../types'

export interface BankContextValue {
  accounts: AccountsById
  deposit: (
    accountId: string,
    amountInput: string,
    description?: string,
  ) => Result<AccountsById>
  withdraw: (
    accountId: string,
    amountInput: string,
    description?: string,
  ) => Result<AccountsById>
  transfer: (
    fromAccountId: string,
    toAccountId: string,
    amountInput: string,
    description?: string,
  ) => Result<AccountsById>
  resetDemoData: () => void
}

export const BankContext = createContext<BankContextValue | null>(null)

export function useBank(): BankContextValue {
  const context = useContext(BankContext)
  if (!context) {
    throw new Error('useBank must be used inside a BankProvider.')
  }
  return context
}
