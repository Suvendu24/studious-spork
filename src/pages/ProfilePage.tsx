import { useBanking } from '../hooks/useBanking'
import { formatDate } from '../lib/format'

export function ProfilePage() {
  const { user, account } = useBanking()

  return (
    <div className="layout">
      <div className="column">
        <section className="card" aria-labelledby="profile-heading">
          <h2 id="profile-heading">Profile</h2>
          <dl className="info-grid" data-testid="profile">
            <dt>Name</dt>
            <dd>{user.name}</dd>
            <dt>Username</dt>
            <dd>{user.username}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
            <dt>Linked account</dt>
            <dd>{account.accountNumber}</dd>
            <dt>Customer since</dt>
            <dd>{formatDate(account.openedAt)}</dd>
          </dl>
        </section>
      </div>
    </div>
  )
}
