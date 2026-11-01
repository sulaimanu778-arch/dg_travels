import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'
import { lagos, naira } from './format'

type Trip = {
  id: string
  status: string
  departs_at: string
  fare_kobo: number
  seat_capacity: number
  seats_taken: number
  parcels_taken: number
  parcel_capacity: number
  routes: { origin_city: string; destination_city: string } | null
  transport_operators: { name: string } | null
}

const SELECT =
  'id,status,departs_at,fare_kobo,seat_capacity,seats_taken,parcels_taken,' +
  'parcel_capacity,routes(origin_city,destination_city),transport_operators(name)'
const FILTERS = ['all', 'pending_approval', 'draft', 'published', 'cancelled', 'completed']
const BTN: Record<string, [string, string, string][]> = {
  pending_approval: [['published', 'Publish', '#0a7b52'], ['cancelled', 'Cancel', '#b91c1c']],
  draft: [['published', 'Publish', '#0a7b52'], ['cancelled', 'Cancel', '#b91c1c']],
  published: [['cancelled', 'Cancel', '#b91c1c']],
  cancelled: [['published', 'Publish again', '#0a7b52']],
}

export default function AdminTrips() {
  const admin = useAdmin()
  const [rows, setRows] = useState<Trip[] | null>(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('trips').select(SELECT)
      .order('departs_at', { ascending: false }).limit(200)
    if (error) { setError(error.message); return }
    setRows((data ?? []) as unknown as Trip[])
  }, [])

  useEffect(() => {
    if (admin === 'yes') load()
  }, [admin, load])

  const change = async (t: Trip, status: string) => {
    if (status === 'cancelled' && !window.confirm('Cancel this trip? Customers with seats may need refunds.')) return
    setBusy(t.id)
    setError('')
    const { error } = await supabase.from('trips').update({ status }).eq('id', t.id)
    setBusy('')
    if (error) setError(error.message)
    else load()
  }

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') return <p className="error">Admins only.</p>

  const shown = (rows ?? []).filter(t => filter === 'all' || t.status === filter)

  return (
    <section>
      <p><Link to="/admin">← Admin</Link></p>
      <h1>Trips</h1>
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
      {error && <p className="error">{error}</p>}
      {!error && rows === null && <p>Loading...</p>}
      {rows && shown.length === 0 && <p className="empty">No trips here.</p>}
      {shown.map(t => (
        <article key={t.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>
              {t.routes ? t.routes.origin_city + ' to ' + t.routes.destination_city : 'Trip'}
            </strong>
            <strong>{naira(t.fare_kobo)}</strong>
          </div>
          <div>{t.status.replace(/_/g, ' ')} · departs {lagos(t.departs_at)}</div>
          <small>
            {t.transport_operators?.name ?? 'No operator'} · seats {t.seats_taken}/{t.seat_capacity}
            · parcels {t.parcels_taken}/{t.parcel_capacity}
          </small>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {(BTN[t.status] ?? []).map(([st, label, color]) => (
              <button key={st} disabled={busy === t.id} onClick={() => change(t, st)}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, background: color, color: '#fff',
                }}>{label}</button>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
