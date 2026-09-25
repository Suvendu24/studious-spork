export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer-in'
  | 'transfer-out'

export interface Transaction {
  id: string
  type: TransactionType
  /** Amount in minor units (cents). Always positive. */
  amountInCents: number
  /** Account balance in cents immediately after this transaction. */
  balanceAfterInCents: number
  description: string
  /** ISO 8601 timestamp. */
  createdAt: string
  /** Name of the other party, for transfers. */
  counterparty?: string
}

export interface Account {
  id: string
  /** Owner of this account. */
  userId: string
  accountNumber: string
  accountHolder: string
  accountType: 'Savings'
  currency: 'USD'
  /** Annual interest rate as a fraction, e.g. 0.035 for 3.5%. */
  interestRate: number
  /** ISO 8601 date the account was opened. */
  openedAt: string
  balanceInCents: number
  transactions: Transaction[]
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  phone: string
  accountId: string
}

/** Demo-only credential record. Passwords are plain text on purpose: this POC
 * has no backend and no real security model. */
export interface MockCredential {
  username: string
  password: string
}

export type AccountsById = Record<string, Account>
