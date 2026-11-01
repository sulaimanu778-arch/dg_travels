import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'

type Counts = { operators: number; trips: number; bookings: number }

async function count(table: string, col?: string, val?: string) {
  let q = supabase.from(table).select('id', { count: 'exact', head: true })
  if (col && val) q = q.eq(col, val)
  const { count: n } = await q
  return n ?? 0
}

export default function Admin() {
  const admin = useAdmin()
  const [c, setC] = useState<Counts | null>(null)

  useEffect(() => {
    if (admin !== 'yes') return
    Promise.all([
      count('transport_operators', 'status', 'pending'),
      count('trips', 'status', 'pending_approval'),
      count('bookings'),
    ]).then(([operators, trips, bookings]) => setC({ operators, trips, bookings }))
  }, [admin])

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') {
    return (
      <section className="card">
        <h1>Admins only</h1>
        <p>This area is for administrators.</p>
        <p><Link to="/dashboard">Back to dashboard</Link></p>
      </section>
    )
  }

  const items = [
    ['Operators waiting for approval', c?.operators],
    ['Trips waiting for approval', c?.trips],
    ['All bookings', c?.bookings],
  ] as const

  return (
    <section>
      <h1>Admin</h1>
      {items.map(([label, n]) => (
        <div key={label} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{label}</span>
          <strong>{n ?? '...'}</strong>
        </div>
      ))}
      <p className="notice">More tools coming: operators, trips, parcels and refunds.</p>
    </section>
  )
}
