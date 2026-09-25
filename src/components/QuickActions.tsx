interface QuickActionsProps {
  onDeposit: () => void
  onWithdraw: () => void
  onTransfer: () => void
}

export function QuickActions({
  onDeposit,
  onWithdraw,
  onTransfer,
}: QuickActionsProps) {
  return (
    <section className="card" aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading">Quick actions</h2>
      <div className="quick-actions" data-testid="quick-actions">
        <button type="button" className="submit deposit" onClick={onDeposit}>
          Quick deposit
        </button>
        <button
          type="button"
          className="submit withdrawal"
          onClick={onWithdraw}
        >
          Quick withdraw
        </button>
        <button type="button" className="submit transfer" onClick={onTransfer}>
          Quick transfer
        </button>
      </div>
    </section>
  )
}
