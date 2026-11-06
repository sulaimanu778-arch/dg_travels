import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESTINATIONS } from './places'
import { C, card } from './ndStyle'

const box = {
  width: '100%', boxSizing: 'border-box', padding: '0.85rem 0.9rem', fontSize: '1rem',
  fontFamily: 'inherit', border: '1px solid #b9c7c1', borderRadius: 12,
  background: '#fff', color: C.navy,
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
    <form onSubmit={go} style={{ ...card, marginTop: -48, position: 'relative', display: 'grid', gap: 10 }}>
      <strong style={{ fontSize: 17 }}>Find a trip</strong>
      <select value={to} onChange={e => setTo(e.target.value)} required style={box}>
        <option value="">From Katsina to...</option>
        {DESTINATIONS.map((d: string) => <option key={d} value={d}>{d}</option>)}
      </select>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={box} />
      <select value={seats} onChange={e => setSeats(Number(e.target.value))} style={box}>
        {[1, 2, 3, 4, 5].map(n => (
          <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
        ))}
      </select>
      <button className="primary" disabled={!to}>Search journeys</button>
    </form>
  )
    }
