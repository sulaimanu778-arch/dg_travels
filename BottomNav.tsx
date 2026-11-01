import { Link, useLocation } from 'react-router-dom'

const ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Home' },
  { to: '/', icon: '🚌', label: 'Travel' },
  { to: '/waybill', icon: '📦', label: 'Waybill' },
  { to: '/my-bookings', icon: '🎫', label: 'Trips' },
]

const CSS = `
.dk-nav{position:fixed;left:0;right:0;bottom:0;z-index:20;background:rgba(11,26,34,.97);border-top:1px solid #243a45;padding-bottom:env(safe-area-inset-bottom,0)}
.dk-navin{display:flex;max-width:640px;margin:0 auto}
.dk-navin a{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:.55rem 0;color:#8aa0aa;text-decoration:none;font-size:11.5px;font-weight:600}
.dk-navin a.on{color:#f59e0b}
.dk-navin a span{font-size:20px}
`

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <div className="dk-nav">
      <style>{CSS}</style>
      <div className="dk-navin">
        {ITEMS.map(i => (
          <Link key={i.to} to={i.to} className={pathname === i.to ? 'on' : ''}>
            <span>{i.icon}</span>
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
