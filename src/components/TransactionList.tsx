import { formatDateTime, formatMoney } from '../lib/format'
import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  currency: string
}

export function TransactionList({
  transactions,
  currency,
}: TransactionListProps) {
  return (
    <section className="card" aria-labelledby="transactions-heading">
      <h2 id="transactions-heading">Recent transactions</h2>
      {transactions.length === 0 ? (
        <p className="empty">No transactions yet.</p>
      ) : (
        <ul className="transactions" data-testid="transaction-list">
          {transactions.map((transaction) => (
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
                <p className={`amount ${transaction.type}`}>
                  {transaction.type === 'deposit' ? '+' : '−'}
                  {formatMoney(transaction.amountInCents, currency)}
                </p>
                <p className="transaction-balance">
                  Balance{' '}
                  {formatMoney(transaction.balanceAfterInCents, currency)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
