import { FormEvent, useEffect, useState } from 'react'
import { supabase } from './supabase'

type Route = { id: string; origin_city: string; destination_city: string; default_fare_kobo: number | null }
type Op = { id: string; name: string }
type Veh = { id: string; operator_id: string; plate_number: string; model: string; seat_capacity: number }

const box = { width: '100%', padding: '.7rem', boxSizing: 'border-box' as const }
const blank = { route: '', op: '', veh: '', dep: '', hours: '6', pickup: '', fare: '', seats: '', parcels: '20' }
type Form = typeof blank

export default function AdminAddTrip({ onAdded }: { onAdded: () => void }) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [ops, setOps] = useState<Op[]>([])
  const [vehs, setVehs] = useState<Veh[]>([])
  const [f, setF] = useState<Form>(blank)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('routes').select('id,origin_city,destination_city,default_fare_kobo')
      .eq('active', true).order('destination_city')
      .then(({ data }) => setRoutes((data ?? []) as Route[]))
    supabase.from('transport_operators').select('id,name').eq('status', 'approved').order('name')
      .then(({ data }) => setOps((data ?? []) as Op[]))
    supabase.from('vehicles').select('id,operator_id,plate_number,model,seat_capacity').eq('active', true)
      .then(({ data }) => setVehs((data ?? []) as Veh[]))
  }, [])

  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const pickRoute = (id: string) => {
    const r = routes.find(x => x.id === id)
    setF({ ...f, route: id, fare: r?.default_fare_kobo ? String(r.default_fare_kobo / 100) : f.fare })
  }
  const pickVeh = (id: string) => {
    const v = vehs.find(x => x.id === id)
    setF({ ...f, veh: id, seats: v ? String(v.seat_capacity) : f.seats })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setMsg('')
    // times are typed as Nigerian time (UTC+1)
    const go = new Date(f.dep + ':00+01:00')
    const arrive = new Date(go.getTime() + Number(f.hours) * 3600000)
    const { error } = await supabase.rpc('admin_add_trip', {
      p_route: f.route, p_operator: f.op, p_vehicle: f.veh,
      p_departs_at: go.toISOString(), p_arrives_at: arrive.toISOString(),
      p_pickup: f.pickup, p_fare_kobo: Math.round(Number(f.fare) * 100),
      p_seats: Number(f.seats), p_parcel_capacity: Number(f.parcels),
    })
    setBusy(false)
    if (error) { setMsg(error.message); return }
    setMsg('Trip added.')
    setF({ ...blank, route: f.route, op: f.op, veh: f.veh, fare: f.fare, seats: f.seats, pickup: f.pickup })
    onAdded()
  }

  const mine = vehs.filter(v => v.operator_id === f.op)
  return (
    <form onSubmit={submit} className="card form">
      <h2>Add a trip</h2>
      {ops.length === 0 && <p className="notice">No approved operators found.</p>}
      <label>Route
        <select required style={box} value={f.route} onChange={e => pickRoute(e.target.value)}>
          <option value="">Choose...</option>
          {routes.map(r => <option key={r.id} value={r.id}>{r.origin_city} to {r.destination_city}</option>)}
        </select>
      </label>
      <label>Operator
        <select required style={box} value={f.op} onChange={e => setF({ ...f, op: e.target.value, veh: '', seats: '' })}>
          <option value="">Choose...</option>
          {ops.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </label>
      <label>Vehicle
        <select required style={box} value={f.veh} onChange={e => pickVeh(e.target.value)}>
          <option value="">Choose...</option>
          {mine.map(v => <option key={v.id} value={v.id}>{v.model} ({v.plate_number}, {v.seat_capacity} seats)</option>)}
        </select>
      </label>
      <label>Departure (Nigerian time)
        <input required type="datetime-local" style={box} value={f.dep} onChange={set('dep')} />
      </label>
      <label>Journey length (hours)
        <input required type="number" min="1" max="48" step="0.5" style={box} value={f.hours} onChange={set('hours')} />
      </label>
      <label>Pickup point
        <input required minLength={3} style={box} value={f.pickup} onChange={set('pickup')} />
      </label>
      <label>Fare per seat (naira)
        <input required type="number" min="1" style={box} value={f.fare} onChange={set('fare')} />
      </label>
      <label>Seats on sale
        <input required type="number" min="1" max="100" style={box} value={f.seats} onChange={set('seats')} />
      </label>
      <label>Waybill space
        <input required type="number" min="0" max="200" style={box} value={f.parcels} onChange={set('parcels')} />
      </label>
      {msg && <p className="notice">{msg}</p>}
      <button className="primary" disabled={busy}>{busy ? 'Adding...' : 'Add trip'}</button>
    </form>
  )
}
