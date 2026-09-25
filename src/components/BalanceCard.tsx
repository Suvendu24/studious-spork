import { projectedAnnualInterestInCents } from '../lib/account'
import { formatMoney, formatPercent } from '../lib/format'
import type { Account } from '../types'

interface BalanceCardProps {
  account: Account
}

export function BalanceCard({ account }: BalanceCardProps) {
  return (
    <section className="card balance-card" aria-labelledby="balance-heading">
      <h2 id="balance-heading">Available balance</h2>
      <p className="balance" data-testid="balance">
        {formatMoney(account.balanceInCents, account.currency)}
      </p>
      <p className="balance-note">
        Earning {formatPercent(account.interestRate)} APY &middot; projected{' '}
        {formatMoney(
          projectedAnnualInterestInCents(account),
          account.currency,
        )}{' '}
        interest per year
      </p>
    </section>
  )
}
