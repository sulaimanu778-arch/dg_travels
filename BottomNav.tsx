import { Link, useLocation } from 'react-router-dom'

const ITEMS = [
  ['/dashboard', '🏠', 'Home'],
  ['/', '🚌', 'Travel'],
  ['/waybill', '📦', 'Waybill'],
  ['/my-bookings', '🎫', 'Trips'],
]

const BAR = {
  position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20,
  display: 'flex', gap: 0, background: '#0b1a22',
  borderTop: '1px solid #243a45',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
} as const

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav style={BAR}>
      {ITEMS.map(([to, icon, label]) => (
        <Link key={to} to={to} style={{
          flex: 1, textAlign: 'center', padding: '8px 0', textDecoration: 'none',
          fontSize: 12, fontWeight: 600,
          color: pathname === to ? '#f59e0b' : '#8aa0aa',
        }}>
          <div style={{ fontSize: 20 }}>{icon}</div>
          {label}
        </Link>
      ))}
    </nav>
  )
  }
