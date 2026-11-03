import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { lagos, naira } from './format'

type Trip = {
  id: string
  departs_at: string
  fare_kobo: number
  seat_capacity: number
  seats_taken: number
  parcel_capacity: number
  parcels_taken: number
  status: string
  routes: { origin_city: string; destination_city: string }
  transport_operators: { name: string } | null
}

const COLS =
  'id,departs_at,fare_kobo,seat_capacity,seats_taken,parcel_capacity,parcels_taken,status,' +
  'routes(origin_city,destination_city),transport_operators(name)'

export default function AdminTrips({ refresh }: { refresh: number }) {
  const [trips, setTrips] = useState<Trip[] | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')

  const load = () =>
    supabase.from('trips').select(COLS)
      .gt('departs_at', new Date().toISOString())
      .neq('status', 'cancelled')
      .order('departs_at')
      .limit(100)
      .then(({ data, error }) => {
        if (error) setMsg(error.message)
        else setTrips(data as unknown as Trip[])
      })

  useEffect(() => { load() }, [refresh])

  const cancel = async (t: Trip) => {
    const name = t.routes.destination_city + ', ' + lagos(t.departs_at)
    if (!window.confirm('Cancel this trip?\n' + name)) return
    setBusy(t.id)
    setMsg('')
    const { error } = await supabase.rpc('admin_cancel_trip', { p_trip: t.id })
    setBusy('')
    if (error) setMsg(error.message)
    else { setMsg('Trip cancelled: ' + name); load() }
  }

  return (
    <div>
      <h2>Upcoming trips</h2>
      {msg && <p className="notice">{msg}</p>}
      {trips === null && !msg && <p>Loading trips...</p>}
      {trips?.length === 0 && <p>No upcoming trips.</p>}
      {trips?.map(t => (
        <div key={t.id} className="card">
          <strong>{t.routes.origin_city} to {t.routes.destination_city}</strong>
          <p>{t.transport_operators?.name ?? 'Operator'} · {lagos(t.departs_at)}</p>
          <p>Fare {naira(t.fare_kobo)} · Status: {t.status}</p>
          <p>Seats sold {t.seats_taken}/{t.seat_capacity} · Waybills {t.parcels_taken}/{t.parcel_capacity}</p>
          <button className="primary" disabled={busy === t.id} onClick={() => cancel(t)}>
            {busy === t.id ? 'Cancelling...' : 'Cancel trip'}
          </button>
        </div>
      ))}
    </div>
  )
}
