import type { Account, Transaction, TransactionType } from '../types'

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: AccountError }

export interface AccountError {
  code:
    | 'INVALID_AMOUNT'
    | 'NON_POSITIVE_AMOUNT'
    | 'TOO_MANY_DECIMALS'
    | 'AMOUNT_TOO_LARGE'
    | 'INSUFFICIENT_FUNDS'
  message: string
}

/** Metadata supplied by the caller so the logic stays pure and deterministic. */
export interface TransactionMeta {
  id: string
  createdAt: string
  description?: string
}

export const MAX_TRANSACTION_IN_CENTS = 1_000_000_00

/**
 * Parses user input such as "125", "125.5" or "1,250.75" into cents.
 * Money is kept in integer cents so arithmetic never hits floating point drift.
 */
export function parseAmountToCents(input: string): Result<number> {
  const normalized = input.trim().replace(/,/g, '')

  if (normalized === '') {
    return err('INVALID_AMOUNT', 'Enter an amount.')
  }
  if (!/^\d*\.?\d*$/.test(normalized)) {
    return err('INVALID_AMOUNT', 'Enter a valid number, for example 150.00.')
  }

  const [whole, fraction = ''] = normalized.split('.')
  if (fraction.length > 2) {
    return err('TOO_MANY_DECIMALS', 'Use at most two decimal places.')
  }

  const cents = Number(whole || '0') * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isFinite(cents)) {
    return err('INVALID_AMOUNT', 'Enter a valid number, for example 150.00.')
  }
  if (cents <= 0) {
    return err('NON_POSITIVE_AMOUNT', 'Amount must be greater than zero.')
  }
  if (cents > MAX_TRANSACTION_IN_CENTS) {
    return err(
      'AMOUNT_TOO_LARGE',
      'Amount exceeds the per-transaction limit of $1,000,000.00.',
    )
  }

  return { ok: true, value: cents }
}

export function deposit(
  account: Account,
  amountInCents: number,
  meta: TransactionMeta,
): Result<Account> {
  const validation = validateAmount(amountInCents)
  if (!validation.ok) {
    return validation
  }

  return {
    ok: true,
    value: applyTransaction(account, 'deposit', amountInCents, meta),
  }
}

export function withdraw(
  account: Account,
  amountInCents: number,
  meta: TransactionMeta,
): Result<Account> {
  const validation = validateAmount(amountInCents)
  if (!validation.ok) {
    return validation
  }
  if (amountInCents > account.balanceInCents) {
    return err(
      'INSUFFICIENT_FUNDS',
      'Insufficient funds for this withdrawal.',
    )
  }

  return {
    ok: true,
    value: applyTransaction(account, 'withdrawal', amountInCents, meta),
  }
}

export function recentTransactions(
  account: Account,
  limit: number,
): Transaction[] {
  return [...account.transactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

export function projectedAnnualInterestInCents(account: Account): number {
  return Math.round(account.balanceInCents * account.interestRate)
}

function validateAmount(amountInCents: number): Result<number> {
  if (!Number.isInteger(amountInCents)) {
    return err('INVALID_AMOUNT', 'Amount must be a whole number of cents.')
  }
  if (amountInCents <= 0) {
    return err('NON_POSITIVE_AMOUNT', 'Amount must be greater than zero.')
  }
  if (amountInCents > MAX_TRANSACTION_IN_CENTS) {
    return err(
      'AMOUNT_TOO_LARGE',
      'Amount exceeds the per-transaction limit of $1,000,000.00.',
    )
  }
  return { ok: true, value: amountInCents }
}

function applyTransaction(
  account: Account,
  type: TransactionType,
  amountInCents: number,
  meta: TransactionMeta,
): Account {
  const balanceInCents =
    type === 'deposit'
      ? account.balanceInCents + amountInCents
      : account.balanceInCents - amountInCents

  const transaction: Transaction = {
    id: meta.id,
    type,
    amountInCents,
    balanceAfterInCents: balanceInCents,
    description:
      meta.description?.trim() ||
      (type === 'deposit' ? 'Deposit' : 'Withdrawal'),
    createdAt: meta.createdAt,
  }

  return {
    ...account,
    balanceInCents,
    transactions: [...account.transactions, transaction],
  }
}

function err(code: AccountError['code'], message: string): Result<never> {
  return { ok: false, error: { code, message } }
}
