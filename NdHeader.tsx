import { Link } from 'react-router-dom'
import { C, greeting } from './ndStyle'

export default function NdHeader({ name }: { name: string }) {
  return (
    <div style={{
      background: `linear-gradient(160deg, ${C.navy}, #0d4d3a 70%, ${C.green2})`,
      color: '#fff', borderRadius: '0 0 28px 28px', margin: '-1rem -1rem 0',
      padding: '1.2rem 1.2rem 4.2rem', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: '50%', background: C.amber, color: C.navy,
        display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20,
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ opacity: 0.8, fontSize: 13 }}>{greeting()},</div>
        <div style={{ fontSize: 20, fontWeight: 800, wordBreak: 'break-word' }}>{name}</div>
      </div>
      <Link to="/support" aria-label="Contact us" style={{
        width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.15)',
        display: 'grid', placeItems: 'center', textDecoration: 'none', fontSize: 20,
      }}>🔔</Link>
    </div>
  )
}
