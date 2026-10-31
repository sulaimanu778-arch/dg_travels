import { CSSProperties, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

type Row = {
  id: string
  reference: string
  seats: number
  status: string
  total_kobo: number
  created_at: string
  hold_expires_at: string | null
  trips: {
    departs_at: string
    pickup_point: string | null
    routes: { origin_city: string; destination_city: string } | null
    transport_operators: { name: string } | null
  } | null
}

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  confirmed: { label: 'Confirmed', bg: '#dcfce7', fg: '#166534' },
  pending_payment: { label: 'Awaiting payment', bg: '#fef3c7', fg: '#92400e' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', fg: '#991b1b' },
  expired: { label: 'Expired', bg: '#e5e7eb', fg: '#374151' },
  refunded: { label: 'Refunded', bg: '#dbeafe', fg: '#1e40af' },
}

const naira = (kobo: number) => '₦' + (kobo / 100).toLocaleString('en-NG')

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: '1.1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}

export default function MyBookings() {
  const nav = useNavigate()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [names, setNames] = useState<Record<string, string[]>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase.auth.getSession()
      if (!s.session) {
        nav('/login', { replace: true })
        return
      }
      const { data, error } = await supabase
        .from('bookings')
        .select(
          'id, reference, seats, status, total_kobo, created_at, hold_expires_at, trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name))'
        )
        .eq('user_id', s.session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }
      const list = (data ?? []) as unknown as Row[]
      setRows(list)

      // Passenger names (if this part fails, the page still works)
      if (list.length > 0) {
        const { data: p } = await supabase
          .from('booking_passengers')
          .select('booking_id, full_name')
          .in('booking_id', list.map(b => b.id))
        const map: Record<string, string[]> = {}
        ;(p ?? []).forEach((x: { booking_id: string; full_name: string }) => {
          ;(map[x.booking_id] ||= []).push(x.full_name)
        })
        setNames(map)
      }
    }
    load()
  }, [nav])

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>My bookings</h1>

      {error && <p className="error">Could not load your bookings: {error}</p>}
      {!error && rows === null && <p>Loading your bookings...</p>}

      {rows?.length === 0 && (
        <div style={card}>
          <p style={{ marginTop: 0 }}>No bookings yet.</p>
          <Link to="/" className="primary" style={{ display: 'inline-block' }}>
            Book a seat
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {rows?.map(b => {
          const holdPassed =
            b.status === 'pending_payment' &&
            b.hold_expires_at !== null &&
            new Date(b.hold_expires_at) < new Date()
          const st = holdPassed
            ? { label: 'Hold expired', bg: '#e5e7eb', fg: '#374151' }
            : STATUS[b.status] ?? { label: b.status, bg: '#e5e7eb', fg: '#374151' }
          const t = b.trips
          return (
            <article key={b.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <strong style={{ fontSize: 18 }}>
                  {t?.routes
                    ? `${t.routes.origin_city} to ${t.routes.destination_city}`
                    : 'Trip details unavailable'}
                </strong>
                <span style={{
                  background: st.bg, color: st.fg, padding: '4px 10px',
                  borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  {st.label}
                </span>
              </div>

              <div style={{ color: '#4b5563', marginTop: 8, display: 'grid', gap: 4 }}>
                {t && <div>Departs: {when(t.departs_at)}</div>}
                {t?.pickup_point && <div>Pickup: {t.pickup_point}</div>}
                {t?.transport_operators?.name && <div>Operator: {t.transport_operators.name}</div>}
                <div>
                  {b.seats} {b.seats === 1 ? 'seat' : 'seats'}
