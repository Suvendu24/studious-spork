import { useId, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockCredentials, mockUsers } from '../data/mockUsers'

export function LoginPage() {
  const { login } = useAuth()
  const usernameId = useId()
  const passwordId = useId()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = login(username, password)
    if (!result.ok) {
      setError(result.error.message)
    }
  }

  return (
    <div className="login">
      <section className="card login-card" aria-labelledby="login-heading">
        <h1 id="login-heading">Sign in</h1>
        <p className="balance-note">
          Savings Bank demo. Mock sign-in only — no real accounts or security.
        </p>
        <form onSubmit={handleSubmit} noValidate data-testid="login-form">
          <label htmlFor={usernameId}>Username</label>
          <input
            id={usernameId}
            name="username"
            autoComplete="username"
            placeholder="suvendu"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setError(null)
            }}
          />

          <label htmlFor={passwordId}>Password</label>
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError(null)
            }}
          />

          <button type="submit" className="submit login">
            Sign in
          </button>

          {error && (
            <p className="message error" role="alert" data-testid="login-error">
              {error}
            </p>
          )}
        </form>
      </section>

      <section className="card" aria-labelledby="demo-credentials-heading">
        <h2 id="demo-credentials-heading">Demo credentials</h2>
        <p className="balance-note">
          These are fake, publicly listed demo credentials for this POC. They
          are checked in the browser against hardcoded mock data — there is no
          backend, no encryption and no real authentication.
        </p>
        <ul className="credentials" data-testid="demo-credentials">
          {mockCredentials.map((credential) => {
            const user = mockUsers.find(
              (candidate) => candidate.username === credential.username,
            )
            return (
              <li key={credential.username}>
                <strong>{user?.name}</strong> — {credential.username} /{' '}
                {credential.password}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
