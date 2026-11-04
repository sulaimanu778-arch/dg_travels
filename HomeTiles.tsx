import { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const TILES = [
  { key: 'book', label: 'Book a seat', icon: '🚌', to: '' },
  { key: 'bookings', label: 'My bookings', icon: '🎫', to: '/my-bookings' },
  { key: 'waybill', label: 'Waybill delivery', icon: '📦', to: '/waybill' },
  { key: 'waybills', label: 'My waybills', icon: '🧾', to: '/my-waybills' },
  { key: 'account', label: 'My account', icon: '👤', to: '/dashboard' },
  { key: 'support', label: 'Contact us', icon: '🎧', to: '/support' },
]

const cell: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 10, padding: '1.5rem 0.5rem', background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: 18, textDecoration: 'none', color: '#10232f', fontWeight: 700,
  fontSize: 16, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center',
  boxShadow: '0 2px 6px rgba(16,35,47,0.06)',
}

const bubble: CSSProperties = {
  width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', fontSize: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export default function HomeTiles({ onBook }: { onBook: () => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 20 }}>
      {TILES.map(t => {
        const inner = (
          <>
            <div style={bubble}>{t.icon}</div>
            <span>{t.label}</span>
          </>
        )
        return t.to
          ? <Link key={t.key} to={t.to} style={cell}>{inner}</Link>
          : <button key={t.key} onClick={onBook} style={cell}>{inner}</button>
      })}
    </div>
  )
}
