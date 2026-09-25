import { AccountInfo } from '../components/AccountInfo'
import { BalanceCard } from '../components/BalanceCard'
import { TransactionList } from '../components/TransactionList'
import { useBanking } from '../hooks/useBanking'
import { recentTransactions } from '../lib/account'

export function AccountPage() {
  const { account } = useBanking()

  return (
    <div className="layout">
      <div className="column">
        <BalanceCard account={account} />
        <AccountInfo account={account} />
      </div>
      <div className="column wide">
        <TransactionList
          transactions={recentTransactions(
            account,
            account.transactions.length,
          )}
          currency={account.currency}
          title="Transaction history"
          testId="transaction-history"
        />
      </div>
    </div>
  )
}
