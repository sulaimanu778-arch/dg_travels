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
  confirmed: ['Confirmed', '#e3f4ec', '#0a6b47'],
  paid: ['Paid', '#e3f4ec', '#0a6b47'],
  pending_payment: ['Awaiting payment', '#fff4d6', '#8a5a00'],
  cancelled: ['Cancelled', '#fde8e8', '#b3261e'],
  expired: ['Expired', '#eceff1', '#4a5d66'],
  refunded: ['Refunded', '#e3effd', '#1d4ed8'],
}

const ROUTE = 'trips(routes(origin_city,destination_city))'
const SHOW = 3

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
          .eq('user_id', userId).order('created_at', { ascending: false }).limit(SHOW),
        supabase.from('parcels')
          .select('id,waybill_no,status,price_kobo,created_at,hold_expires_at,' + ROUTE)
          .eq('user_id', userId).order('created_at', { ascending: false }).limit(SHOW),
      ])
      const tickets = ((b.data ?? []) as any[]).map((x): Item => ({
        id: x.id, kind: 'ticket', ref: x.reference, route: routeOf(x),
        status: lapsed(x) ? 'expired' : x.status, kobo: x.total_kobo, at: x.created_at,
      }))
      const waybills = ((p.data ?? []) as any[]).map((x): Item => ({
        id: x.id, kind: 'waybill', ref: x.waybill_no, route: routeOf(x),
        status: lapsed(x) ? 'expired' : x.status, kobo: x.price_kobo, at: x.created_at,
      }))
      const all = [...tickets, ...waybills]
      setItems(all.sort((a, c) => c.at.localeCompare(a.at)).slice(0, SHOW))
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
        const [label, bg, fg] = BADGE[i.status] ?? [i.status.replace(/_/g, ' '), '#eceff1', '#4a5d66']
        const unpaid = ['pending_payment', 'expired', 'cancelled'].includes(i.status)
        const to = i.kind === 'ticket'
          ? (i.status === 'confirmed' ? '/receipt/' + i.id : '/my-bookings')
          : (unpaid ? '/waybill' : '/my-waybills')
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
