import { viewLabels, views, type View } from '../navigation'

interface NavBarProps {
  current: View
  onNavigate: (view: View) => void
  onLogout: () => void
}

export function NavBar({ current, onNavigate, onLogout }: NavBarProps) {
  return (
    <nav className="nav" aria-label="Main" data-testid="main-nav">
      <ul className="nav-links">
        {views.map((view) => (
          <li key={view}>
            <button
              type="button"
              className={`nav-link${view === current ? ' active' : ''}`}
              aria-current={view === current ? 'page' : undefined}
              onClick={() => onNavigate(view)}
            >
              {viewLabels[view]}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="nav-link logout"
        onClick={onLogout}
        data-testid="logout"
      >
        Logout
      </button>
    </nav>
  )
}
