import { Link } from 'react-router-dom'
import { C, greeting } from './ndStyle'

export default function NdHeader({ name, onLogout }: { name: string; onLogout?: () => void }) {
  const btn = {
    width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.15)',
    display: 'grid', placeItems: 'center', textDecoration: 'none', color: '#fff',
    border: 'none', cursor: 'pointer', padding: 0,
  } as const

  return (
    <div style={{
      background: `linear-gradient(160deg, ${C.navy}, #13355A 70%, ${C.green2})`,
      color: '#fff', borderRadius: '0 0 28px 28px', margin: '-1rem -1rem 0',
      padding: '1.2rem 1.2rem 4.2rem', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: '50%', background: '#fff', color: C.navy,
        display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20,
        border: `2px solid ${C.green2}`,
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ opacity: 0.8, fontSize: 13 }}>{greeting()},</div>
        <div style={{ fontSize: 20, fontWeight: 800, wordBreak: 'break-word' }}>{name}</div>
      </div>
      <Link to="/support" aria-label="Contact support" style={btn}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="14" width="4" height="6" rx="1" />
          <rect x="17" y="14" width="4" height="6" rx="1" />
        </svg>
      </Link>
      {onLogout && (
        <button type="button" onClick={onLogout} aria-label="Log out" style={btn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </button>
      )}
    </div>
  )
}
