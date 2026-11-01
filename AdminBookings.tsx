import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'
import { lagos, naira } from './format'

type B = {
  id: string
  user_id: string
  reference: string
  seats: number
  status: string
  total_kobo: number
  created_at: string
  trips: {
    departs_at: string
    routes: { origin_city: string; destination_city: string } | null
  } | null
}
type P = { id: string; username: string | null; full_name: string; phone: string | null }

const SELECT =
  'id,user_id,reference,seats,status,total_kobo,created_at,' +
  'trips(departs_at,routes(origin_city,destination_city))'
const FILTERS = ['all', 'pending_payment', 'confirmed', 'cancelled', 'expired', 'refunded']

export default function AdminBookings() {
  const admin = useAdmin()
  const [rows, setRows] = useState<B[] | null>(null)
  const [people, setPeople] = useState<Record<string, P>>({})
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    if (admin !== 'yes') return
    supabase.from('bookings').select(SELECT)
      .order('created_at', { ascending: false }).limit(200)
      .then(async ({ data, error }) => {
        if (error) { setError(error.message); return }
        const list = (data ?? []) as unknown as B[]
        setRows(list)
        const ids = [...new Set(list.map(b => b.user_id))]
        if (ids.length === 0) return
        const { data: ps } = await supabase.from('profiles')
          .select('id,username,full_name,phone').in('id', ids)
        const map: Record<string, P> = {}
        ;((ps ?? []) as P[]).forEach(p => { map[p.id] = p })
        setPeople(map)
      })
  }, [admin])

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') return <p className="error">Admins only.</p>

  const shown = (rows ?? []).filter(b => filter === 'all' || b.status === filter)

  return (
    <section>
      <p><Link to="/admin">← Admin</Link></p>
      <h1>All bookings</h1>
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
      {error && <p className="error">Could not load bookings: {error}</p>}
      {!error && rows === null && <p>Loading...</p>}
      {rows && shown.length === 0 && <p className="empty">No bookings here.</p>}
      {shown.map(b => {
        const p = people[b.user_id]
        const r = b.trips?.routes
        return (
          <article key={b.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{r ? r.origin_city + ' to ' + r.destination_city : 'Trip'}</strong>
              <strong>{naira(b.total_kobo)}</strong>
            </div>
            <div>{b.reference} · {b.status.replace(/_/g, ' ')}</div>
            <div>{b.seats} {b.seats === 1 ? 'seat' : 'seats'}
              {b.trips ? ' · departs ' + lagos(b.trips.departs_at) : ''}</div>
            <small>
              {p ? (p.username || p.full_name || 'Customer') : 'Customer'}
              {p?.phone ? ' · ' + p.phone : ''} · booked {lagos(b.created_at)}
            </small>
          </article>
        )
      })}
    </section>
  )
}
