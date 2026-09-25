import { useRef } from 'react'
import { BalanceCard } from '../components/BalanceCard'
import { QuickActions } from '../components/QuickActions'
import { SummaryCard } from '../components/SummaryCard'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { useBanking } from '../hooks/useBanking'
import { recentTransactions } from '../lib/account'
import { summarize } from '../lib/bank'

const RECENT_TRANSACTION_COUNT = 5

interface DashboardPageProps {
  onTransfer: () => void
}

export function DashboardPage({ onTransfer }: DashboardPageProps) {
  const { account, submit } = useBanking()
  const depositAmountRef = useRef<HTMLInputElement>(null)
  const withdrawalAmountRef = useRef<HTMLInputElement>(null)

  return (
    <div className="layout">
      <div className="column">
        <BalanceCard account={account} />
        <SummaryCard
          summary={summarize(account.transactions)}
          currency={account.currency}
        />
        <QuickActions
          onDeposit={() => depositAmountRef.current?.focus()}
          onWithdraw={() => withdrawalAmountRef.current?.focus()}
          onTransfer={onTransfer}
        />
      </div>
      <div className="column">
        <TransactionForm
          type="deposit"
          onSubmit={submit}
          amountRef={depositAmountRef}
        />
        <TransactionForm
          type="withdrawal"
          onSubmit={submit}
          amountRef={withdrawalAmountRef}
        />
      </div>
      <div className="column wide">
        <TransactionList
          transactions={recentTransactions(account, RECENT_TRANSACTION_COUNT)}
          currency={account.currency}
        />
      </div>
    </div>
  )
}
