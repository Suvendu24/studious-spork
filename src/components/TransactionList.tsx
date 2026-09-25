import { isCredit } from '../lib/account'
import { formatDateTime, formatMoney } from '../lib/format'
import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  currency: string
  title?: string
  testId?: string
}

export function TransactionList({
  transactions,
  currency,
  title = 'Recent transactions',
  testId = 'transaction-list',
}: TransactionListProps) {
  return (
    <section className="card" aria-labelledby="transactions-heading">
      <h2 id="transactions-heading">{title}</h2>
      {transactions.length === 0 ? (
        <p className="empty">No transactions yet.</p>
      ) : (
        <ul className="transactions" data-testid={testId}>
          {transactions.map((transaction) => {
            const credit = isCredit(transaction.type)
            return (
              <li key={transaction.id} className="transaction">
                <div>
                  <p className="transaction-description">
                    {transaction.description}
                  </p>
                  <p className="transaction-date">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="transaction-amounts">
                  <p
                    className={`amount ${credit ? 'deposit' : 'withdrawal'}`}
                  >
                    {credit ? '+' : '−'}
                    {formatMoney(transaction.amountInCents, currency)}
                  </p>
                  <p className="transaction-balance">
                    Balance{' '}
                    {formatMoney(transaction.balanceAfterInCents, currency)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
