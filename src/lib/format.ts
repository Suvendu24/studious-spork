export function formatMoney(amountInCents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100)
}

export function formatDateTime(isoTimestamp: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoTimestamp))
}

export function formatDate(isoTimestamp: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
    new Date(isoTimestamp),
  )
}

export function formatPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(rate)
}
