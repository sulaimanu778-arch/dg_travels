import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import WaybillHeld, { Held } from './WaybillHeld'
import WaybillFields, { EMPTY } from './WaybillFields'

const COLS =
  'id,pickup_point,departs_at,fare_kobo,' +
  'routes!inner(origin_city,destination_city),transport_operators(name)'

type TripRow = {
  id: string
  pickup_point: string
  departs_at: string
  fare_kobo: number
  routes: { origin_city: string; destination_city: string }
  transport_operators: { name: string } | null
}

export default function WaybillForm() {
  const { id } = useParams()
  const [trip, setTrip] = useState<TripRow | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [f, setF] = useState(EMPTY)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [held, setHeld] = useState<Held | null>(null)
  const key = useRef(crypto.randomUUID())

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    supabase.from('trips').select(COLS).eq('id', id!).single().then(({ data, error }) => {
      if (error) setError(error.message)
      else setTrip(data as unknown as TripRow)
    })
  }, [id])

  useEffect(() => {
    key.current = crypto.randomUUID()
  }, [JSON.stringify(f), agree])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { data, error } = await supabase.rpc('create_parcel_hold', {
      p_trip_id: id,
      p_size: f.size,
      p_sender_name: f.sender_name,
      p_sender_phone: f.sender_phone,
      p_receiver_name: f.receiver_name,
      p_receiver_phone: f.receiver_phone,
      p_description: f.description,
      p_accept_terms: agree,
      p_idempotency_key: key.current,
    })
    setBusy(false)
    if (error) setError(error.message)
    else setHeld(data as Held)
  }

  if (error && !trip) return <p className="error">Could not load this trip: {error}</p>
  if (!trip) return <p>Loading trip...</p>
  if (held) return <WaybillHeld held={held} />

  return (
    <section>
      <h1>Waybill: {trip.routes.origin_city} to {trip.routes.destination_city}</h1>
      <p>
        {trip.transport_operators?.name} · departs {lagos(trip.departs_at)} ·{' '}
        {naira(trip.fare_kobo)}
      </p>
      {loggedIn === false ? (
        <p className="notice">
          <Link to="/login">Log in or create an account</Link> to send a waybill.
        </p>
      ) : (
        <form onSubmit={submit} className="card form">
          <WaybillFields f={f} setF={setF} agree={agree} setAgree={setAgree} />
          <p>
            Price: <strong>{naira(trip.fare_kobo)}</strong>. A payment processing
            fee is shown at checkout.
          </p>
          {error && <p className="error">{error}</p>}
          <button className="primary" disabled={busy || !agree}>
            {busy ? 'Holding space...' : 'Hold my waybill space'}
          </button>
        </form>
      )}
    </section>
  )
      }
