import { Link, useLocation } from 'react-router-dom'
import { C } from './ndStyle'

const ITEMS: { to: string; label: string; icon: JSX.Element }[] = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
  },
  {
    to: '/my-bookings',
    label: 'Tickets',
    icon: (
      <>
        <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
        <path d="M14 6v12" />
      </>
    ),
  },
  {
    to: '/my-waybills',
    label: 'Waybills',
    icon: (
      <>
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3 8l9 5 9-5M12 13v8" />
      </>
    ),
  },
  {
    to: '/history',
    label: 'History',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    to: '/support',
    label: 'Contact',
    icon: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1" />
        <rect x="17" y="14" width="4" height="6" rx="1" />
      </>
    ),
  },
]

export default function NdNav() {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Main" style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, display: 'flex',
      background: '#fff', borderTop: '1px solid #dde5ee',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {ITEMS.map(({ to, label, icon }) => {
        const active = pathname === to
        return (
          <Link key={to} to={to} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '8px 0 7px', textDecoration: 'none', position: 'relative',
            fontSize: 11.5, fontWeight: 600, color: active ? C.green2 : C.soft,
          }}>
            {active && (
              <span style={{
                position: 'absolute', top: 0, width: 28, height: 3,
                borderRadius: '0 0 3px 3px', background: C.green2,
              }} />
            )}
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={active ? 2 : 1.7}
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icon}
            </svg>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
