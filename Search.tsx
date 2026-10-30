import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira, Trip, TRIP_COLUMNS } from './format'

export default function Search() {
  const [params] = useSearchParams()
  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const date = params.get('date')
  const seats = Number(params.get('seats') ?? 1)
  const [trips, setTrips] = useState<Trip[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setTrips(null)
    setError('')
    const now = new Date()
    let start = now
    let q = supabase.from('trips').select(TRIP_COLUMNS)
      .eq('status', 'published')
      .ilike('routes.origin_city', from.trim())
      .ilike('routes.destination_city', to.trim())
      .order('departs_at')
    if (date) {
      // Nigeria is UTC+1 all year, so a Lagos day runs 00:00 to 23:59 at +01:00
      const dayStart = new Date(`${date}T00:00:00+01:00`)
      if (dayStart > start) start = dayStart
      q = q.lte('departs_at', `${date}T23:59:59+01:00`)
    }
    q = q.gt('departs_at', start.toISOString())
    q.then(({ data, error }) => {
      if (error) setError(error.message)
      else setTrips((data as unknown as Trip[]).filter(t => t.seat_capacity - t.seats_taken >= seats))
    })
  }, [from, to, date, seats])

  return (
    <section>
      <h1>{from} to {to}</h1>
      {error && <p className="error">Could not load trips: {error}</p>}
      {!error && trips === null && <p>Loading trips…</p>}
      {trips?.length === 0 && (
        <p className="empty">No trips match yet. Try another date or <Link to="/">change your search</Link>.</p>
      )}
      {trips?.map(t => (
        <article key={t.id} className="card trip">
          <div>
            <strong>{t.transport_operators?.name ?? 'Operator'}</strong>
            <p>Departs {lagos(t.departs_at)}</p>
            <p>Arrives about {lagos(t.estimated_arrival_at)}</p>
            <p>Pickup: {t.pickup_point}</p>
            <p>{t.seat_capacity - t.seats_taken} seats left</p>
          </div>
          <div className="price">
            <span>{naira(t.fare_kobo)}</span>
            <small>per seat</small>
            <Link className="primary" to={`/trip/${t.id}?seats=${seats}`}>Select seats</Link>
          </div>
        </article>
      ))}
    </section>
  )
}
