import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { lagos, naira, Trip, TRIP_COLUMNS } from './format'

type Held = { reference: string; seats: number; total_kobo: number; hold_expires_at: string }

export default function Book({ session }: { session: Session | null }) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [error, setError] = useState('')
  const [seats, setSeats] = useState(Math.max(1, Number(params.get('seats') ?? 1)))
  const [people, setPeople] = useState([{ full_name: '', phone: '' }])
  const [busy, setBusy] = useState(false)
  const [held, setHeld] = useState<Held | null>(null)
  const key = useRef(crypto.randomUUID())

  useEffect(() => {
    supabase.from('trips').select(TRIP_COLUMNS).eq('id', id!).single().then(({ data, error }) => {
      if (error) setError(error.message)
      else setTrip(data as unknown as Trip)
    })
  }, [id])

  // keep one passenger row per seat
  useEffect(() => {
    setPeople(p => Array.from({ length: seats }, (_, i) => p[i] ?? { full_name: '', phone: '' }))
  }, [seats])

  // a changed form is a new request, so it gets a new duplicate-protection key
  useEffect(() => { key.current = crypto.randomUUID() }, [seats, JSON.stringify(people)])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { data, error } = await supabase.rpc('create_booking_hold', {
      p_trip_id: id,
      p_seats: seats,
      p_passengers: people,
      p_idempotency_key: key.current,
    })
    setBusy(false)
    if (error) setError(error.message)
    else setHeld(data as Held)
  }

  if (error && !trip) return <p className="error">Could not load this trip: {error}</p>
  if (!trip) return <p>Loading trip…</p>

  const left = trip.seat_capacity - trip.seats_taken

  if (held) {
    return (
      <section className="card">
        <h1>Seats held</h1>
        <p>Booking reference: <strong>{held.reference}</strong></p>
        <p>{held.seats} seat(s), fare {naira(held.total_kobo)}. Held until {lagos(held.hold_expires_at)}.</p>
        <p className="notice">Payment is not connected yet. Your seats are only held, not paid for, and will be released when the hold ends.</p>
      </section>
    )
  }

  return (
    <section>
      <h1>{trip.routes.origin_city} to {trip.routes.destination_city}</h1>
      <p>{trip.transport_operators?.name} · departs {lagos(trip.departs_at)} · {naira(trip.fare_kobo)} per seat · {left} left</p>
      {!session ? (
        <p className="notice"><Link to="/login">Log in or create an account</Link> to hold seats.</p>
      ) : (
        <form onSubmit={submit} className="card form">
          <label>Seats
            <input type="number" min={1} max={Math.min(5, left)} value={seats} onChange={e => setSeats(Number(e.target.value))} />
          </label>
          {people.map((p, i) => (
            <fieldset key={i}>
              <legend>Passenger {i + 1}</legend>
              <label>Full name
                <input required minLength={2} value={p.full_name}
                  onChange={e => setPeople(x => x.map((v, j) => j === i ? { ...v, full_name: e.target.value } : v))} />
              </label>
              <label>Phone (optional)
                <input type="tel" value={p.phone}
                  onChange={e => setPeople(x => x.map((v, j) => j === i ? { ...v, phone: e.target.value } : v))} />
              </label>
            </fieldset>
          ))}
          <p>Fare total: <strong>{naira(trip.fare_kobo * seats)}</strong>. A payment processing fee is shown at checkout.</p>
          {error && <p className="error">{error}</p>}
          <button className="primary" disabled={busy || left < 1}>{busy ? 'Holding seats…' : 'Hold my seats'}</button>
        </form>
      )}
    </section>
  )
}
