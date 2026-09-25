import { useCallback, useEffect, useState } from 'react'
import { mockAccount } from '../data/mockAccount'
import {
  deposit,
  parseAmountToCents,
  withdraw,
  type AccountError,
  type TransactionMeta,
} from '../lib/account'
import { clearAccount, loadAccount, saveAccount } from '../lib/storage'
import type { Account, TransactionType } from '../types'

export interface SubmitResult {
  ok: boolean
  error?: AccountError
}

export interface UseAccountResult {
  account: Account
  submit: (
    type: TransactionType,
    amountInput: string,
    description?: string,
  ) => SubmitResult
  reset: () => void
}

export function useAccount(): UseAccountResult {
  const [account, setAccount] = useState<Account>(() =>
    loadAccount(mockAccount),
  )

  useEffect(() => {
    saveAccount(account)
  }, [account])

  const submit = useCallback(
    (
      type: TransactionType,
      amountInput: string,
      description?: string,
    ): SubmitResult => {
      const parsed = parseAmountToCents(amountInput)
      if (!parsed.ok) {
        return { ok: false, error: parsed.error }
      }

      const meta: TransactionMeta = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        description,
      }

      const result =
        type === 'deposit'
          ? deposit(account, parsed.value, meta)
          : withdraw(account, parsed.value, meta)

      if (!result.ok) {
        return { ok: false, error: result.error }
      }

      setAccount(result.value)
      return { ok: true }
    },
    [account],
  )

  const reset = useCallback(() => {
    clearAccount()
    setAccount(mockAccount)
  }, [])

  return { account, submit, reset }
}
