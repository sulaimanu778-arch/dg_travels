import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function Home() {
  const nav = useNavigate()
  const [cities, setCities] = useState<string[]>([])
  const [from, setFrom] = useState('Katsina')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)

  useEffect(() => {
    supabase.from('routes').select('origin_city,destination_city').eq('active', true).then(({ data }) => {
      const all = (data ?? []).flatMap(r => [r.origin_city, r.destination_city])
      setCities([...new Set(all)].sort())
    })
  }, [])

  const go = (e: FormEvent) => {
    e.preventDefault()
    const q = new URLSearchParams({ from, to, seats: String(seats) })
    if (date) q.set('date', date)
    nav('/search?' + q.toString())
  }

  return (
    <section>
      <h1>Book a seat out of Katsina</h1>
      <p className="lead">Compare operators, fares and departure times, then hold your seat.</p>
      <form onSubmit={go} className="card form">
        <datalist id="cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
        <label>From<input list="cities" value={from} onChange={e => setFrom(e.target.value)} required /></label>
        <label>To<input list="cities" value={to} onChange={e => setTo(e.target.value)} required /></label>
        <label>Travel date (optional)<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <label>Passengers
          <input type="number" min={1} max={5} value={seats} onChange={e => setSeats(Number(e.target.value))} />
        </label>
        <button className="primary">Search trips</button>
      </form>
    </section>
  )
}
