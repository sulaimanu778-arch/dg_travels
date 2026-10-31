import { CSSProperties, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

const DESTINATIONS = [
  'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Daura', 'Delta', 'Dutsinma', 'Ebonyi',
  'Edo', 'Ekiti', 'Enugu', 'Funtua', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun',
  'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Zaria',
]

const COLS =
  'id,pickup_point,departs_at,fare_kobo,parcel_capacity,parcels_taken,' +
  'routes!inner(origin_city,destination_city),transport_operators(name)'

type Row = {
  id: string
  pickup_point: string
  departs_at: string
  fare_kobo: number
  parcel_capacity: number
  parcels_taken: number
  transport_operators: { name: string } | null
}

const field: CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '0.9rem 1rem', fontSize: '1rem',
  fontFamily: 'inherit', border: '1px solid #9ca3af', borderRadius: '10px',
  background: '#fff', color: '#111827',
}

export default function WaybillSearch() {
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setRows(null)
    let start = new Date()
    let q = supabase.from('trips').select(COLS)
      .eq('status', 'published')
      .ilike('routes.origin_city', 'Katsina')
      .ilike('routes.destination_city', to)
      .order('departs_at')
    if (date) {
      const dayStart = new Date(`${date}T00:00:00+01:00`)
      if (dayStart > start) start = dayStart
      q = q.lte('departs_at', `${date}T23:59:59+01:00`)
    }
    q = q.gt('departs_at', start.toISOString())
    const { data, error } = await q
    setBusy(false)
    if (error) setError(error.message)
    else setRows((data as unknown as Row[]).filter(t => t.parcel_capacity - t.parcels_taken > 0))
  }

  return (
    <section>
      <h1>Waybill delivery from Katsina</h1>
      <p className="lead">Send a parcel with a verified operator. The price is the same as the passenger fare for that trip.</p>
      <form onSubmit={go} className="card form">
        <label>From
          <input value="Katsina" readOnly disabled style={field} />
        </label>
        <label>To
          <select value={to} onChange={e => setTo(e.target.value)} required style={field}>
            <option value="">Select destination</option>
            {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>Date (optional)
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={field} />
        </label>
        <button className="primary" disabled={!to || busy}>{busy ? 'Searching...' : 'Find trips'}</button>
      </form>

      {error && <p className="error">Could not load trips: {error}</p>}
      {rows?.length === 0 && <p className="empty">No trips with waybill space match yet. Try another date.</p>}
      {rows?.map(t => (
        <article key={t.id} className="card trip">
          <div>
            <strong>{t.transport_operators?.name ?? 'Operator'}</strong>
            <p>Departs {lagos(t.departs_at)}</p>
            <p>Drop-off: {t.pickup_point}</p>
            <p>{t.parcel_capacity - t.parcels_taken} waybill spaces left</p>
          </div>
          <div className="price">
            <span>{naira(t.fare_kobo)}</span>
            <small>per waybill</small>
            <Link className="primary" to={'/waybill/trip/' + t.id}>Send here</Link>
          </div>
        </article>
      ))}
    </section>
  )
}
