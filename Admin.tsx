import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'

async function count(table: string, col?: string, val?: string) {
  let q = supabase.from(table).select('id', { count: 'exact', head: true })
  if (col && val) q = q.eq(col, val)
  const { count: n } = await q
  return n ?? 0
}

export default function Admin() {
  const admin = useAdmin()
  const [n, setN] = useState<number[] | null>(null)

  useEffect(() => {
    if (admin !== 'yes') return
    Promise.all([
      count('transport_operators', 'status', 'pending'),
      count('trips', 'status', 'pending_approval'),
      count('bookings'),
      count('payments', 'status', 'refund_pending'),
      count('parcels'),
    ]).then(setN)
  }, [admin])

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') {
    return (
      <section className="card">
        <h1>Admins only</h1>
        <p><Link to="/dashboard">Back to dashboard</Link></p>
      </section>
    )
  }

  const rows: [string, number | undefined, string | null][] = [
    ['Operators waiting for approval', n?.[0], '/admin/operators'],
    ['Trips waiting for approval', n?.[1], null],
    ['All bookings', n?.[2], '/admin/bookings'],
    ['All parcels', n?.[4], '/admin/parcels'],
    ['Refunds waiting', n?.[3], '/admin/refunds'],
  ]

  return (
    <section>
      <h1>Admin</h1>
      {rows.map(([label, v, to]) => {
        const body = (
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{label}{to ? ' ›' : ''}</span>
            <strong>{v ?? '...'}</strong>
          </div>
        )
        return to
          ? <Link key={label} to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{body}</Link>
          : <div key={label}>{body}</div>
      })}
      <p className="notice">Coming next: trips.</p>
    </section>
  )
}
