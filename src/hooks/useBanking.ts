import { useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBank } from '../context/BankContext'
import type { AccountError } from '../lib/account'
import type { Account, TransactionType, User } from '../types'

export interface OperationResult {
  ok: boolean
  error?: AccountError
}

export interface UseBankingResult {
  user: User
  account: Account
  /** Accounts the current user may transfer to, never their own. */
  recipients: Account[]
  submit: (
    type: 'deposit' | 'withdrawal',
    amountInput: string,
    description?: string,
  ) => OperationResult
  sendTransfer: (
    toAccountId: string,
    amountInput: string,
    description?: string,
  ) => OperationResult
  resetDemoData: () => void
}

/**
 * Binds every banking operation to the signed-in user's own account, so the
 * UI has no way to read or mutate another user's account except by naming a
 * recipient in a transfer.
 */
export function useBanking(): UseBankingResult {
  const { user } = useAuth()
  const { accounts, deposit, withdraw, transfer, resetDemoData } = useBank()

  const account = user ? accounts[user.accountId] : undefined
  const accountId = account?.id ?? ''

  const recipients = useMemo(
    () => Object.values(accounts).filter((other) => other.id !== accountId),
    [accounts, accountId],
  )

  const submit = useCallback(
    (
      type: Extract<TransactionType, 'deposit' | 'withdrawal'>,
      amountInput: string,
      description?: string,
    ): OperationResult => {
      const result =
        type === 'deposit'
          ? deposit(accountId, amountInput, description)
          : withdraw(accountId, amountInput, description)
      return result.ok ? { ok: true } : { ok: false, error: result.error }
    },
    [accountId, deposit, withdraw],
  )

  const sendTransfer = useCallback(
    (
      toAccountId: string,
      amountInput: string,
      description?: string,
    ): OperationResult => {
      const result = transfer(accountId, toAccountId, amountInput, description)
      return result.ok ? { ok: true } : { ok: false, error: result.error }
    },
    [accountId, transfer],
  )

  if (!user || !account) {
    throw new Error('useBanking requires an authenticated user with an account.')
  }

  return { user, account, recipients, submit, sendTransfer, resetDemoData }
}
