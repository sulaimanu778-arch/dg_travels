import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const FROM_CITY = 'Katsina'
const MAX_PASSENGERS = 5

export default function Home() {
  const nav = useNavigate()
  const [destinations, setDestinations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)

  useEffect(() => {
    supabase
      .from('routes')
      .select('destination_city')
      .eq('active', true)
      .ilike('origin_city', FROM_CITY)
      .then(({ data }) => {
        const list = (data ?? []).map(r => r.destination_city as string)
        setDestinations([...new Set(list)].sort())
        setLoading(false)
      })
  }, [])

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
          <input value={FROM_CITY} readOnly disabled />
        </label>

        <label>To
          <select value={to} onChange={e => setTo(e.target.value)} required>
            <option value="">
              {loading ? 'Loading destinations...' : 'Select destination'}
            </option>
            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        {!loading && destinations.length === 0 && (
          <p className="error">No destinations are available right now. Please check back soon.</p>
        )}

        <label>Travel date (optional)
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <label>Number of passengers
          <select value={seats} onChange={e => setSeats(Number(e.target.value))}>
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
