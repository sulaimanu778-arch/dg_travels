import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

type Item = {
  id: string
  kind: 'ticket' | 'waybill'
  ref: string
  route: string
  status: string
  kobo: number
  at: string
}

const BADGE: Record<string, [string, string, string]> = {
  confirmed: ['Confirmed', '#0f3d2e', '#6ee7b7'],
  paid: ['Paid', '#0f3d2e', '#6ee7b7'],
  pending_payment: ['Awaiting payment', '#4a3410', '#fcd34d'],
  cancelled: ['Cancelled', '#4b1d1d', '#fca5a5'],
  expired: ['Expired', '#2b3a43', '#b8c7ce'],
  refunded: ['Refunded', '#12304d', '#93c5fd'],
}

const ROUTE = 'trips(routes(origin_city,destination_city))'

function routeOf(row: any) {
  const r = row.trips?.routes
  return r ? r.origin_city + ' to ' + r.destination_city : 'Trip'
}

function lapsed(row: any) {
  return (
    row.status === 'pending_payment' &&
    row.hold_expires_at &&
    new Date(row.hold_expires_at) < new Date()
  )
}

export default function RecentBookings({ userId }: { userId: string }) {
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    const load = async () => {
      const [b, p] = await Promise.all([
        supabase.from('bookings')
          .select('id,reference,status,total_kobo,created_at,hold_expires_at,' + ROUTE)
          .eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
        supabase.from('parcels')
          .select('id,waybill_no,status,price_kobo,created_at,hold_expires_at,' + ROUTE)
          .eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      ])
      const tickets = ((b.data ?? []) as any[]).map((x): Item => ({
        id: x.id, kind: 'ticket', ref: x.reference, route: routeOf(x),
        status: lapsed(x) ? 'expired' : x.status, kobo: x.total_kobo, at: x.created_at,
      }))
      const waybills = ((p.data ?? []) as any[]).map((x): Item => ({
        id: x.id, kind: 'waybill', ref: x.waybill_no, route: routeOf(x),
        status: lapsed(x) ? 'expired' : x.status, kobo: x.price_kobo, at: x.created_at,
      }))
      setItems([...tickets, ...waybills].sort((a, c) => c.at.localeCompare(a.at)).slice(0, 6))
    }
    load()
  }, [userId])

  if (items === null) return null
  if (items.length === 0) {
    return <div className="dk-empty">No bookings yet. Book a seat or send a waybill to see it here.</div>
  }

  return (
    <div className="dk-rec">
      {items.map(i => {
        const [label, bg, fg] = BADGE[i.status] ?? [i.status.replace(/_/g, ' '), '#2b3a43', '#b8c7ce']
        const unpaid = ['pending_payment', 'expired', 'cancelled'].includes(i.status)
        const to = i.kind === 'ticket'
          ? (i.status === 'confirmed' ? '/receipt/' + i.id : '/my-bookings')
          : (unpaid ? '/waybill' : '/waybill/receipt/' + i.id)
        return (
          <Link key={i.kind + i.id} to={to} className="dk-card">
            <div className="dk-top">
              <strong>{(i.kind === 'ticket' ? '🎫 ' : '📦 ') + i.route}</strong>
              <span className="dk-badge" style={{ background: bg, color: fg }}>{label}</span>
            </div>
            <small>{i.ref}</small>
            <div className="dk-foot"><span>{lagos(i.at)}</span><b>{naira(i.kobo)}</b></div>
          </Link>
        )
      })}
    </div>
  )
}
