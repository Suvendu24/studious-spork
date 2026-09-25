import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createSeedAccounts } from '../data/mockAccounts'
import { parseAmountToCents, type Result } from '../lib/account'
import { depositTo, transfer as transferBetween, withdrawFrom } from '../lib/bank'
import { clearAccounts, loadAccounts, saveAccounts } from '../lib/storage'
import type { AccountsById } from '../types'
import { BankContext, type BankContextValue } from './BankContext'

export function BankProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AccountsById>(() =>
    loadAccounts(createSeedAccounts()),
  )

  useEffect(() => {
    saveAccounts(accounts)
  }, [accounts])

  const run = useCallback(
    (
      operation: (current: AccountsById) => Result<AccountsById>,
    ): Result<AccountsById> => {
      const result = operation(accounts)
      if (result.ok) {
        setAccounts(result.value)
      }
      return result
    },
    [accounts],
  )

  const deposit = useCallback<BankContextValue['deposit']>(
    (accountId, amountInput, description) => {
      const parsed = parseAmountToCents(amountInput)
      if (!parsed.ok) {
        return parsed
      }
      return run((current) =>
        depositTo(current, accountId, parsed.value, {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          description,
        }),
      )
    },
    [run],
  )

  const withdraw = useCallback<BankContextValue['withdraw']>(
    (accountId, amountInput, description) => {
      const parsed = parseAmountToCents(amountInput)
      if (!parsed.ok) {
        return parsed
      }
      return run((current) =>
        withdrawFrom(current, accountId, parsed.value, {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          description,
        }),
      )
    },
    [run],
  )

  const transfer = useCallback<BankContextValue['transfer']>(
    (fromAccountId, toAccountId, amountInput, description) => {
      const parsed = parseAmountToCents(amountInput)
      if (!parsed.ok) {
        return parsed
      }
      return run((current) =>
        transferBetween(current, fromAccountId, toAccountId, parsed.value, {
          outgoingId: crypto.randomUUID(),
          incomingId: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          description,
        }),
      )
    },
    [run],
  )

  const resetDemoData = useCallback(() => {
    clearAccounts()
    setAccounts(createSeedAccounts())
  }, [])

  const value = useMemo<BankContextValue>(
    () => ({ accounts, deposit, withdraw, transfer, resetDemoData }),
    [accounts, deposit, withdraw, transfer, resetDemoData],
  )

  return <BankContext value={value}>{children}</BankContext>
}
