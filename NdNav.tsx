import { Link, useLocation } from 'react-router-dom'
import { C } from './ndStyle'

const ITEMS: [string, string, string][] = [
  ['/dashboard', '🏠', 'Home'],
  ['/my-bookings', '🎫', 'Tickets'],
  ['/my-waybills', '📦', 'Waybills'],
  ['/history', '🕘', 'History'],
  ['/support', '🎧', 'Contact'],
]

export default function NdNav() {
  const { pathname } = useLocation()
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, display: 'flex',
      background: '#fff', borderTop: '1px solid #e3e9e6',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {ITEMS.map(([to, icon, label]) => (
        <Link key={to} to={to} style={{
          flex: 1, textAlign: 'center', padding: '8px 0', textDecoration: 'none',
          fontSize: 11.5, fontWeight: 700, color: pathname === to ? C.green : C.soft,
        }}>
          <div style={{ fontSize: 20 }}>{icon}</div>
          {label}
        </Link>
      ))}
    </div>
  )
}
