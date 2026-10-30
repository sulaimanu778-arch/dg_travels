import { CSSProperties, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FROM_CITY = 'Katsina'
const MAX_PASSENGERS = 5

// All Nigerian states plus the FCT (Katsina is the departure point).
const DESTINATIONS = [
  'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

// Makes dropdowns the same size and look as the other boxes.
const fieldStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.9rem 1rem',
  fontSize: '1rem',
  fontFamily: 'inherit',
  border: '1px solid #9ca3af',
  borderRadius: '10px',
  background: '#fff',
  color: '#111827',
}

export default function Home() {
  const nav = useNavigate()
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)

  const go = (e: FormEvent) => {
    e.preventDefault()
    if (!to) return
    const q = new URLSearchParams({ from: FROM_CITY, to, seats: String(seats) })
    if (date) q.set('date', date)
    nav('/search?' + q.toString())
  }

  return (
    <section>
      <h1>Book a seat out of Katsina</h1>
      <p className="lead">Compare operators, fares and departure times, then hold your seat.</p>
      <form onSubmit={go} className="card form">
        <label>From
          <input value={FROM_CITY} readOnly disabled style={fieldStyle} />
        </label>

        <label>To
          <select value={to} onChange={e => setTo(e.target.value)} required style={fieldStyle}>
            <option value="">Select destination</option>
            {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>

        <label>Travel date (optional)
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
        </label>

        <label>Number of passengers
          <select value={seats} onChange={e => setSeats(Number(e.target.value))} style={fieldStyle}>
            {Array.from({ length: MAX_PASSENGERS }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
            ))}
          </select>
        </label>

        <button className="primary" disabled={!to}>Search Journeys</button>
      </form>
    </section>
  )
    }
