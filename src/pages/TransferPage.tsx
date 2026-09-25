import { BalanceCard } from '../components/BalanceCard'
import { TransactionList } from '../components/TransactionList'
import { TransferForm } from '../components/TransferForm'
import { useBanking } from '../hooks/useBanking'
import { recentTransactions } from '../lib/account'

const RECENT_TRANSACTION_COUNT = 5

export function TransferPage() {
  const { account, recipients, sendTransfer } = useBanking()

  return (
    <div className="layout">
      <div className="column">
        <TransferForm recipients={recipients} onSubmit={sendTransfer} />
      </div>
      <div className="column">
        <BalanceCard account={account} />
        <TransactionList
          transactions={recentTransactions(account, RECENT_TRANSACTION_COUNT)}
          currency={account.currency}
        />
      </div>
    </div>
  )
}
