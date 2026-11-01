import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { lagos, naira, Trip, TRIP_COLUMNS } from './format'
import { cleanPhone, isPhone, PHONE_MESSAGE } from './phone'

type Held = { id: string; reference: string; seats: number; total_kobo: number; hold_expires_at: string }

export default function Book({ session }: { session: Session | null }) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [error, setError] = useState('')
  const [seats, setSeats] = useState(Math.max(1, Number(params.get('seats') ?? 1)))
  const [people, setPeople] = useState([{ full_name: '', phone: '' }])
  const [busy, setBusy] = useState(false)
  const [paying, setPaying] = useState(false)
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
    if (people.some(p => !isPhone(p.phone))) {
      setError(PHONE_MESSAGE)
      return
    }
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

  // Ask our server to start the Paystack payment, then go to Paystack's page
  const pay = async () => {
    if (!held) return
    setPaying(true)
    setError('')
    const { data, error } = await supabase.functions.invoke('paystack-init', {
      body: { booking_id: held.id },
    })
    // the answer can arrive as text or a blob, so unwrap it first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let out: any = data
    if (out instanceof Blob) out = await out.text()
    if (typeof out === 'string') {
      try { out = JSON.parse(out) } catch (_e) { /* keep as text */ }
    }
    if (error || !out?.url) {
      let why: string = out?.error ?? ''
      if (!why && error) {
        try {
          const ctx = (error as { context?: Response }).context
          const body = ctx ? await ctx.json() : null
          why = body?.error ?? ''
        } catch (_e) { /* ignore */ }
        if (!why) why = error.message
      }
      if (!why) {
        why = 'No payment link came back. Got: ' + typeof data + ' ' + String(JSON.stringify(out)).slice(0, 120)
      }
      setError('Could not start payment: ' + why)
      setPaying(false)
    } else {
      window.location.href = out.url
    }
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
        <p className="notice">Pay before the hold ends or your seats are released. A small payment processing fee is added on the next page.</p>
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={pay} disabled={paying}>
          {paying ? 'Opening payment…' : 'Pay now'}
        </button>
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
              <label>Phone (11 digits)
                <input type="tel" inputMode="numeric" required maxLength={11}
                  pattern="[0-9]{11}" title={PHONE_MESSAGE} placeholder="08012345678"
                  value={p.phone}
                  onChange={e => setPeople(x => x.map((v, j) => j === i ? { ...v, phone: cleanPhone(e.target.value) } : v))} />
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
