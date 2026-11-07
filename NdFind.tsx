import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESTINATIONS } from './places'
import { C, card } from './ndStyle'

const box = {
  width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.9rem', fontSize: '1rem',
  fontFamily: 'inherit', border: '1px solid #cfd9e5', borderRadius: 12,
  background: '#F3F6FA', color: C.navy,
} as const

const label = {
  display: 'grid', gap: 6, fontSize: 12.5, fontWeight: 600, color: C.soft,
} as const

export default function NdFind() {
  const nav = useNavigate()
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)

  const go = (e: FormEvent) => {
    e.preventDefault()
    if (!to) return
    const q = new URLSearchParams({ from: 'Katsina', to, seats: String(seats) })
    if (date) q.set('date', date)
    nav('/search?' + q.toString())
  }

  return (
    <form onSubmit={go} style={{
      ...card, marginTop: -48, position: 'relative', display: 'grid', gap: 12,
      borderRadius: 20, padding: '1.1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: '#E8F1FF',
          color: C.green2, display: 'grid', placeItems: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>
        <div>
          <strong style={{ fontSize: 17, color: C.navy }}>Find a trip</strong>
          <div style={{ fontSize: 12.5, color: C.soft }}>Departing from Katsina</div>
        </div>
      </div>

      <label style={label}>
        Destination
        <select value={to} onChange={e => setTo(e.target.value)} required style={box}>
          <option value="">Select destination</option>
          {DESTINATIONS.map((d: string) => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label style={label}>
          Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={box} />
        </label>
        <label style={label}>
          Passengers
          <select value={seats} onChange={e => setSeats(Number(e.target.value))} style={box}>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      <button className="primary" disabled={!to} style={{ width: '100%', padding: '0.9rem', fontWeight: 700 }}>
        Search journeys
      </button>
    </form>
  )
}
