import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import BookingCard from './BookingCard'
import { Row, Tab, card, tabOf } from './bookingUtils'

const EMPTY: Record<Tab, string> = {
  upcoming: 'No upcoming trips.',
  past: 'No past trips yet.',
  cancelled: 'No cancelled or expired bookings.',
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function MyBookings() {
  const nav = useNavigate()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [names, setNames] = useState<Record<string, string[]>>({})
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('upcoming')

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
          'id, reference, seats, status, total_kobo, hold_expires_at, trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name))'
        )
        .eq('user_id', s.session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }
      const list = (data ?? []) as unknown as Row[]
      setRows(list)

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

  const counts = { upcoming: 0, past: 0, cancelled: 0 }
  rows?.forEach(b => {
    counts[tabOf(b)] += 1
  })
  const shown = (rows ?? []).filter(b => tabOf(b) === tab)

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>My trips</h1>

      <div style={{ display: 'flex', gap: 8, margin: '12px 0 16px' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: '0.7rem 0.4rem',
              borderRadius: 12,
              border: '1px solid ' + (tab === t.key ? '#0f9d6e' : '#d1d5db'),
              background: tab === t.key ? '#0f9d6e' : '#fff',
              color: tab === t.key ? '#fff' : '#111827',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {error && <p className="error">Could not load your trips: {error}</p>}
      {!error && rows === null && <p>Loading your trips...</p>}

      {rows !== null && shown.length === 0 && (
        <div style={card}>
          <p style={{ marginTop: 0 }}>{EMPTY[tab]}</p>
          {tab === 'upcoming' && (
            <Link to="/" className="primary" style={{ display: 'inline-block' }}>
              Book a seat
            </Link>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {shown.map(b => (
          <BookingCard
            key={b.id}
            b={b}
            who={names[b.id]?.length ? ' (' + names[b.id].join(', ') + ')' : ''}
          />
        ))}
      </div>
    </section>
  )
      }
