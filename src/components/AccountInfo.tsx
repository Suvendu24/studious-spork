import { formatDate } from '../lib/format'
import type { Account } from '../types'

interface AccountInfoProps {
  account: Account
}

export function AccountInfo({ account }: AccountInfoProps) {
  return (
    <section className="card" aria-labelledby="account-info-heading">
      <h2 id="account-info-heading">Account information</h2>
      <dl className="info-grid" data-testid="account-info">
        <dt>Account holder</dt>
        <dd>{account.accountHolder}</dd>
        <dt>Account number</dt>
        <dd>{account.accountNumber}</dd>
        <dt>Account type</dt>
        <dd>{account.accountType}</dd>
        <dt>Currency</dt>
        <dd>{account.currency}</dd>
        <dt>Opened on</dt>
        <dd>{formatDate(account.openedAt)}</dd>
      </dl>
    </section>
  )
}
