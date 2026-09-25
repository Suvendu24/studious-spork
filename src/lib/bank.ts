import {
  applyTransaction,
  deposit,
  err,
  isCredit,
  validateAmount,
  type Result,
  type TransactionMeta,
} from './account'
import type { AccountsById, Transaction } from '../types'

export interface TransferMeta {
  outgoingId: string
  incomingId: string
  createdAt: string
  description?: string
}

export interface MoneySummary {
  incomeInCents: number
  expenseInCents: number
}

/** Deposits into a single account inside the shared multi-account state. */
export function depositTo(
  accounts: AccountsById,
  accountId: string,
  amountInCents: number,
  meta: TransactionMeta,
): Result<AccountsById> {
  const account = accounts[accountId]
  if (!account) {
    return err('UNKNOWN_ACCOUNT', 'Account not found.')
  }

  const result = deposit(account, amountInCents, meta)
  if (!result.ok) {
    return result
  }

  return { ok: true, value: { ...accounts, [accountId]: result.value } }
}

/** Withdraws from a single account inside the shared multi-account state. */
export function withdrawFrom(
  accounts: AccountsById,
  accountId: string,
  amountInCents: number,
  meta: TransactionMeta,
): Result<AccountsById> {
  const account = accounts[accountId]
  if (!account) {
    return err('UNKNOWN_ACCOUNT', 'Account not found.')
  }

  const validation = validateAmount(amountInCents)
  if (!validation.ok) {
    return validation
  }
  if (amountInCents > account.balanceInCents) {
    return err('INSUFFICIENT_FUNDS', 'Insufficient funds for this withdrawal.')
  }

  return {
    ok: true,
    value: {
      ...accounts,
      [accountId]: applyTransaction(account, 'withdrawal', amountInCents, meta),
    },
  }
}

/**
 * Moves money between two accounts. Both sides are written in a single new
 * state object, so a transfer can never leave the mock ledger half applied.
 */
export function transfer(
  accounts: AccountsById,
  fromAccountId: string,
  toAccountId: string,
  amountInCents: number,
  meta: TransferMeta,
): Result<AccountsById> {
  if (toAccountId === '') {
    return err('NO_RECIPIENT', 'Select a recipient.')
  }
  if (fromAccountId === toAccountId) {
    return err('SAME_ACCOUNT', 'You cannot transfer to your own account.')
  }

  const sender = accounts[fromAccountId]
  const recipient = accounts[toAccountId]
  if (!sender || !recipient) {
    return err('UNKNOWN_ACCOUNT', 'Account not found.')
  }

  const validation = validateAmount(amountInCents)
  if (!validation.ok) {
    return validation
  }
  if (amountInCents > sender.balanceInCents) {
    return err('INSUFFICIENT_FUNDS', 'Insufficient funds for this transfer.')
  }

  const description = meta.description?.trim()

  return {
    ok: true,
    value: {
      ...accounts,
      [fromAccountId]: applyTransaction(sender, 'transfer-out', amountInCents, {
        id: meta.outgoingId,
        createdAt: meta.createdAt,
        description: description || `Transfer to ${recipient.accountHolder}`,
        counterparty: recipient.accountHolder,
      }),
      [toAccountId]: applyTransaction(recipient, 'transfer-in', amountInCents, {
        id: meta.incomingId,
        createdAt: meta.createdAt,
        description: description || `Transfer from ${sender.accountHolder}`,
        counterparty: sender.accountHolder,
      }),
    },
  }
}

export function summarize(transactions: Transaction[]): MoneySummary {
  return transactions.reduce<MoneySummary>(
    (summary, transaction) => {
      if (isCredit(transaction.type)) {
        summary.incomeInCents += transaction.amountInCents
      } else {
        summary.expenseInCents += transaction.amountInCents
      }
      return summary
    },
    { incomeInCents: 0, expenseInCents: 0 },
  )
}
