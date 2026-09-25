import { useState } from 'react'
import { NavBar } from './components/NavBar'
import { useAuth } from './context/AuthContext'
import { useBanking } from './hooks/useBanking'
import { AccountPage } from './pages/AccountPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { TransferPage } from './pages/TransferPage'
import type { View } from './navigation'
import './App.css'

function App() {
  const { user, logout } = useAuth()
  const [view, setView] = useState<View>('dashboard')

  if (!user) {
    return <LoginPage />
  }

  return (
    <BankingApp
      view={view}
      onNavigate={setView}
      onLogout={() => {
        setView('dashboard')
        logout()
      }}
    />
  )
}

interface BankingAppProps {
  view: View
  onNavigate: (view: View) => void
  onLogout: () => void
}

function BankingApp({ view, onNavigate, onLogout }: BankingAppProps) {
  const { user, account, resetDemoData } = useBanking()

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Savings Account</h1>
          <p>
            Welcome back, <span data-testid="current-user">{user.name}</span> ·{' '}
            <span data-testid="current-account">{account.accountNumber}</span>
          </p>
        </div>
        <button type="button" className="reset" onClick={resetDemoData}>
          Reset demo data
        </button>
      </header>

      <NavBar current={view} onNavigate={onNavigate} onLogout={onLogout} />

      <main data-testid={`${view}-page`}>
        {view === 'dashboard' && (
          <DashboardPage onTransfer={() => onNavigate('transfer')} />
        )}
        {view === 'account' && <AccountPage />}
        {view === 'transfer' && <TransferPage />}
        {view === 'profile' && <ProfilePage />}
      </main>
    </div>
  )
}

export default App
