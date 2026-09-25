import { AccountInfo } from './components/AccountInfo'
import { BalanceCard } from './components/BalanceCard'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useAccount } from './hooks/useAccount'
import { recentTransactions } from './lib/account'
import './App.css'

const RECENT_TRANSACTION_COUNT = 5

function App() {
  const { account, submit, reset } = useAccount()

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Savings Account</h1>
          <p>Welcome back, {account.accountHolder}</p>
        </div>
        <button type="button" className="reset" onClick={reset}>
          Reset demo data
        </button>
      </header>

      <main className="layout">
        <div className="column">
          <BalanceCard account={account} />
          <AccountInfo account={account} />
        </div>
        <div className="column">
          <TransactionForm type="deposit" onSubmit={submit} />
          <TransactionForm type="withdrawal" onSubmit={submit} />
        </div>
        <div className="column wide">
          <TransactionList
            transactions={recentTransactions(
              account,
              RECENT_TRANSACTION_COUNT,
            )}
            currency={account.currency}
          />
        </div>
      </main>
    </div>
  )
}

export default App
