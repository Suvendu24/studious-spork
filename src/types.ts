export type TransactionType = 'deposit' | 'withdrawal'

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
}

export interface Account {
  id: string
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
