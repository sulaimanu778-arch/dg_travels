import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEEP, DESTINATIONS, GOLD, GREEN, NAVY } from './homeStyles'
import { greeting } from './dashStyles'
import { BRAND, TAGLINE } from './brand'

export default function HomeHeader({ username }: { username: string }) {
  const nav = useNavigate()
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const go = (e: FormEvent) => {
    e.preventDefault()
    const found = DESTINATIONS.find(d => d.toLowerCase() === text.trim().toLowerCase())
    if (!found) { setError('Please choose a destination from the list.'); return }
    setError('')
    nav('/search?from=Katsina&to=' + encodeURIComponent(found) + '&seats=1')
  }

  return (
    <div className="h-up" style={{
      position: 'relative', overflow: 'hidden', color: '#fff', borderRadius: 28,
      padding: '1.2rem 1.2rem 1.4rem', borderBottom: `5px solid ${GOLD}`,
      background: `radial-gradient(circle at 90% 15%, rgba(245,158,11,0.4), transparent 38%), radial-gradient(circle at 5% 100%, rgba(15,157,110,0.6), transparent 45%), linear-gradient(135deg, ${NAVY}, ${DEEP})`,
    }}>
      <div className="h-float" style={{ position: 'absolute', right: 14, top: 58, fontSize: 84, opacity: 0.22 }}>🚌</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: GOLD, borderRadius: 12, padding: '4px 8px', fontSize: 22 }}>🚌</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic' }}>{BRAND}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{TAGLINE}</div>
          </div>
        </div>
        <div style={{
          width: 46, height: 46, borderRadius: '50%', background: GREEN, fontSize: 22, fontWeight: 800,
          border: '3px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{username.charAt(0).toUpperCase()}</div>
      </div>

      <div style={{ marginTop: 18, position: 'relative' }}>
        <div style={{ fontSize: 18, opacity: 0.95 }}>{greeting()} 👋</div>
        <div style={{ fontSize: 34, fontWeight: 800, wordBreak: 'break-word' }}>{username}</div>
        <div style={{ fontSize: 16, opacity: 0.9 }}>Where are you travelling today?</div>
      </div>

      <form onSubmit={go} style={{
        marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
        borderRadius: 999, padding: '0.35rem 0.4rem 0.35rem 1rem', position: 'relative',
      }}>
        <input list="dg-dest" value={text} onChange={e => setText(e.target.value)}
          placeholder="Search for destination (e.g. Abuja, Lagos)"
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', color: '#111827' }} />
        <datalist id="dg-dest">
          {DESTINATIONS.map(d => <option key={d} value={d} />)}
        </datalist>
        <button style={{
          width: 42, height: 42, borderRadius: '50%', border: 'none', background: GOLD,
          fontSize: 20, fontWeight: 800, cursor: 'pointer', color: NAVY,
        }}>→</button>
      </form>
      {error && <div style={{ marginTop: 8, fontSize: 13, color: '#fde68a' }}>{error}</div>}
    </div>
  )
}
