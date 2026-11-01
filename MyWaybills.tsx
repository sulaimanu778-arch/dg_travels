import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

type Row = {
  id: string
  waybill_no: string
  size: string
  price_kobo: number
  status: string
  receiver_name: string
  created_at: string
  hold_expires_at: string | null
  trips: { departs_at: string; routes: { origin_city: string; destination_city: string } | null } | null
}

const COLS = 'id,waybill_no,size,price_kobo,status,receiver_name,created_at,hold_expires_at,' +
  'trips(departs_at,routes(origin_city,destination_city))'

const LABEL: Record<string, [string, string, string]> = {
  pending_payment: ['Awaiting payment', '#fef3c7', '#92400e'],
  paid: ['Paid, drop it off', '#dcfce7', '#166534'],
  received: ['Received by operator', '#dbeafe', '#1e40af'],
  loaded: ['Loaded', '#dbeafe', '#1e40af'],
  in_transit: ['On the way', '#e0e7ff', '#3730a3'],
  arrived: ['Arrived', '#fae8ff', '#86198f'],
  delivered: ['Delivered', '#dcfce7', '#166534'],
  cancelled: ['Cancelled', '#fee2e2', '#991b1b'],
  expired: ['Expired', '#e5e7eb', '#374151'],
  refunded: ['Refunded', '#dbeafe', '#1e40af'],
}

type Tab = 'active' | 'done' | 'closed'

const statusOf = (r: Row) =>
  r.status === 'pending_payment' && r.hold_expires_at && new Date(r.hold_expires_at) < new Date()
    ? 'expired' : r.status

const tabOf = (s: string): Tab =>
  s === 'delivered' ? 'done' : ['cancelled', 'expired', 'refunded'].includes(s) ? 'closed' : 'active'

export default function MyWaybills() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [tab, setTab] = useState<Tab>('active')
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { setLoggedIn(false); return }
      const res = await supabase.from('parcels').select(COLS)
        .eq('user_id', data.session.user.id)
        .order('created_at', { ascending: false })
      if (res.error) setError('Could not load your waybills.')
      else setRows(res.data as unknown as Row[])
    })
  }, [])

  if (!loggedIn) return <p className="notice"><Link to="/login">Log in</Link> to see your waybills.</p>
  if (error) return <p className="error">{error}</p>
  if (!rows) return <p>Loading your waybills...</p>

  const shown = rows.filter(r => tabOf(statusOf(r)) === tab)
  const tabs: [Tab, string][] = [['active', 'Active'], ['done', 'Delivered'], ['closed', 'Closed']]

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>My waybills</h1>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        {tabs.map(([k, name]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '0.6rem', borderRadius: 999, fontWeight: 600, cursor: 'pointer',
            border: '1px solid #d1d5db', background: tab === k ? '#10232f' : '#fff',
            color: tab === k ? '#fff' : '#111827',
          }}>{name}</button>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="empty">Nothing here yet. <Link to="/waybill">Send a waybill</Link></p>
      )}
      {shown.map(r => {
        const [label, bg, fg] = LABEL[statusOf(r)] ?? [r.status, '#e5e7eb', '#374151']
        const route = r.trips?.routes
          ? r.trips.routes.origin_city + ' to ' + r.trips.routes.destination_city : 'Trip unavailable'
        return (
          <article key={r.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{route}</strong>
              <span style={{ background: bg, color: fg, padding: '3px 10px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>
            <p>Waybill no: <strong>{r.waybill_no}</strong></p>
            <p>To: {r.receiver_name} · Size: {r.size}</p>
            {r.trips && <p>Departs: {lagos(r.trips.departs_at)}</p>}
            <p>Price: <strong>{naira(r.price_kobo)}</strong> · Sent: {lagos(r.created_at)}</p>
          </article>
        )
      })}
    </section>
  )
}
