import { formatMoney } from '../lib/format'
import type { MoneySummary } from '../lib/bank'

interface SummaryCardProps {
  summary: MoneySummary
  currency: string
}

export function SummaryCard({ summary, currency }: SummaryCardProps) {
  const net = summary.incomeInCents - summary.expenseInCents

  return (
    <section className="card" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Income &amp; expenses</h2>
      <dl className="info-grid" data-testid="summary">
        <dt>Money in</dt>
        <dd data-testid="summary-income">
          {formatMoney(summary.incomeInCents, currency)}
        </dd>
        <dt>Money out</dt>
        <dd data-testid="summary-expense">
          {formatMoney(summary.expenseInCents, currency)}
        </dd>
        <dt>Net</dt>
        <dd data-testid="summary-net">{formatMoney(net, currency)}</dd>
      </dl>
    </section>
  )
}
