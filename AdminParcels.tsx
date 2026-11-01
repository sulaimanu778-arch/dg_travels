import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'
import { lagos, naira } from './format'
import ParcelActions from './ParcelActions'
import ParcelDeliver from './ParcelDeliver'
import ParcelHistory from './ParcelHistory'

type Parcel = {
  id: string
  waybill_no: string
  size: string
  price_kobo: number
  status: string
  sender_name: string
  sender_phone: string
  receiver_name: string
  receiver_phone: string
  description: string | null
  created_at: string
  trips: {
    departs_at: string
    routes: { origin_city: string; destination_city: string } | null
  } | null
}

const SELECT =
  'id,waybill_no,size,price_kobo,status,sender_name,sender_phone,' +
  'receiver_name,receiver_phone,description,created_at,' +
  'trips(departs_at,routes(origin_city,destination_city))'
const FILTERS = [
  'all', 'pending_payment', 'paid', 'received', 'loaded', 'in_transit',
  'arrived', 'delivered', 'cancelled', 'expired', 'refunded',
]

export default function AdminParcels() {
  const admin = useAdmin()
  const [rows, setRows] = useState<Parcel[] | null>(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('parcels').select(SELECT)
      .order('created_at', { ascending: false }).limit(200)
    if (error) { setError(error.message); return }
    setRows((data ?? []) as unknown as Parcel[])
  }, [])

  useEffect(() => {
    if (admin === 'yes') load()
  }, [admin, load])

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') return <p className="error">Admins only.</p>

  const shown = (rows ?? []).filter(p => filter === 'all' || p.status === filter)

  return (
    <section>
      <p><Link to="/admin">← Admin</Link></p>
      <h1>All parcels</h1>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 14px' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontWeight: 600,
            border: '1px solid #0a7b52',
            background: filter === f ? '#0a7b52' : '#fff',
            color: filter === f ? '#fff' : '#0a7b52',
          }}>{f.replace(/_/g, ' ')}</button>
        ))}
      </div>
      {error && <p className="error">Could not load parcels: {error}</p>}
      {!error && rows === null && <p>Loading...</p>}
      {rows && shown.length === 0 && <p className="empty">No parcels here.</p>}
      {shown.map(p => {
        const r = p.trips?.routes
        return (
          <article key={p.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{r ? r.origin_city + ' to ' + r.destination_city : 'Trip'}</strong>
              <strong>{naira(p.price_kobo)}</strong>
            </div>
            <div>{p.waybill_no} · {p.status.replace(/_/g, ' ')} · {p.size}</div>
            <div>From {p.sender_name} ({p.sender_phone})</div>
            <div>To {p.receiver_name} ({p.receiver_phone})</div>
            {p.description && <small>{p.description}</small>}
            <small style={{ display: 'block' }}>
              {p.trips ? 'Departs ' + lagos(p.trips.departs_at) + ' · ' : ''}
              created {lagos(p.created_at)}
            </small>
            <ParcelActions parcelId={p.id} status={p.status} onDone={load} />
            <ParcelDeliver parcelId={p.id} status={p.status} onDone={load} />
            <ParcelHistory parcelId={p.id} />
          </article>
        )
      })}
    </section>
  )
}
