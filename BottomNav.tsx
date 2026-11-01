import { Link, useLocation } from 'react-router-dom'
import { NAV_CSS } from './darkNav'

const ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Home' },
  { to: '/', icon: '🚌', label: 'Travel' },
  { to: '/waybill', icon: '📦', label: 'Waybill' },
  { to: '/my-bookings', icon: '🎫', label: 'Trips' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <div className="dk-nav">
      <style>{NAV_CSS}</style>
      <div className="dk-navin">
        {ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={pathname === item.to ? 'on' : ''}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
