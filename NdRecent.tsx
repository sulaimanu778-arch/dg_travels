import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import { C, card } from './ndStyle'

type Item = {
  id: string; kind: 'ticket' | 'waybill'; ref: string
  route: string; status: string; kobo: number; at: string
}

const CHIP: Record<string, [string, string, string]> = {
  confirmed: ['Confirmed', '#dcfce7', '#166534'],
  paid: ['Paid', '#dcfce7', '#166534'],
  pending_payment: ['Pending', '#fef3c7', '#92400e'],
  cancelled: ['Cancelled', '#fee2e2', '#991b1b'],
  expired: ['Expired', '#e5e7eb', '#374151'],
  refunded: ['Refunded', '#dbeafe', '#1e40af'],
}
const ROUTE = 'trips(routes(origin_city,destination_city))'

function routeOf(x: any) {
  const r = x.trips?.routes
  return r ? r.origin_city + ' → ' + r.destination_city : 'Trip'
}
function status(x: any) {
  const lapsed = x.status === 'pending_payment' && x.hold_expires_at &&
    new Date(x.hold_expires_at) < new Date()
  return lapsed ? 'expired' : x.status
}

export default function NdRecent({ userId }: { userId: string }) {
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('bookings')
        .select('id,reference,status,total_kobo,created_at,hold_expires_at,' + ROUTE)
        .eq('user_id', userId).order('created_at', { ascending: false }).limit(4),
      supabase.from('parcels')
        .select('id,waybill_no,status,price_kobo,created_at,hold_expires_at,' + ROUTE)
        .eq('user_id', userId).order('created_at', { ascending: false }).limit(4),
    ]).then(([b, p]) => {
      const t = ((b.data ?? []) as any[]).map((x): Item => ({
        id: x.id, kind: 'ticket', ref: x.reference, route: routeOf(x),
        status: status(x), kobo: x.total_kobo, at: x.created_at,
      }))
      const w = ((p.data ?? []) as any[]).map((x): Item => ({
        id: x.id, kind: 'waybill', ref: x.waybill_no, route: routeOf(x),
        status: status(x), kobo: x.price_kobo, at: x.created_at,
      }))
      setItems([...t, ...w].sort((a, c) => c.at.localeCompare(a.at)).slice(0, 5))
    })
  }, [userId])

  const link = (i: Item) => {
    const unpaid = ['pending_payment', 'expired', 'cancelled'].includes(i.status)
    if (i.kind === 'ticket') return i.status === 'confirmed' ? '/receipt/' + i.id : '/my-bookings'
    return unpaid ? '/my-waybills' : '/waybill/receipt/' + i.id
  }

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Recent tickets</h2>
        <Link to="/history" style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>See all ›</Link>
      </div>
      {items === null && <p>Loading...</p>}
      {items?.length === 0 && <p style={{ color: C.soft }}>No tickets yet. Search a trip above.</p>}
      {items?.map(i => {
        const [label, bg, fg] = CHIP[i.status] ?? [i.status.replace(/_/g, ' '), '#e0f2fe', '#075985']
        return (
          <Link key={i.kind + i.id} to={link(i)} style={{
            ...card, display: 'block', marginTop: 10, textDecoration: 'none', color: C.navy,
            borderLeft: `5px solid ${C.green}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{(i.kind === 'ticket' ? '🎫 ' : '📦 ') + i.route}</strong>
              <span style={{
                background: bg, color: fg, padding: '2px 10px', borderRadius: 999,
                fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            <div style={{ color: C.soft, fontSize: 13, marginTop: 4 }}>{i.ref} · {lagos(i.at)}</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>{naira(i.kobo)}</div>
          </Link>
        )
      })}
    </div>
  )
}
