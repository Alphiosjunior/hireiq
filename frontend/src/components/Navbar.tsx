import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

function Navbar({ theme, toggleTheme }: NavbarProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{
      background: 'var(--glass-bg)',
      borderBottom: '1px solid var(--glass-border)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span style={{
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--accent)',
        letterSpacing: '-0.5px'
      }}>
        HireIQ
      </span>

      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { path: '/', label: 'Dashboard' },
          { path: '/applications', label: 'Applications' },
          { path: '/interview-prep', label: 'Interview Prep' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              color: isActive(path) ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive(path) ? 'var(--glass-bg)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <button
        onClick={toggleTheme}
        className="btn-ghost"
        style={{ fontSize: '13px' }}
      >
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </nav>
  )
}

export default Navbar