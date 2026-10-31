import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, STATUS, card, holdPassed, naira, when } from './bookingUtils'
import { supabase } from './supabase'

export default function BookingCard({ b, who }: { b: Row; who: string }) {
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const expired = holdPassed(b)
  const st = expired
    ? { label: 'Hold expired', bg: '#e5e7eb', fg: '#374151' }
    : STATUS[b.status] ?? { label: b.status, bg: '#e5e7eb', fg: '#374151' }
  const t = b.trips
  const route = t?.routes
    ? t.routes.origin_city + ' to ' + t.routes.destination_city
    : 'Trip details unavailable'
  const canPay = b.status === 'pending_payment' && !expired

  const pay = async () => {
    setPaying(true)
    setError('')
    const { data, error } = await supabase.functions.invoke('paystack-init', {
      body: { booking_id: b.id },
    })
    if (error || !data?.url) {
      setError('Could not start payment. Please try again.')
      setPaying(false)
    } else {
      window.location.href = data.url
    }
  }

  return (
    <article style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <strong style={{ fontSize: 18 }}>{route}</strong>
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
        <div>{b.seats + (b.seats === 1 ? ' seat' : ' seats') + who}</div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 12,
        paddingTop: 10, borderTop: '1px solid #f1f5f9',
      }}>
        <span style={{ color: '#6b7280' }}>Ref: {b.reference}</span>
        <strong>{naira(b.total_kobo)}</strong>
      </div>

      {error && <p className="error">{error}</p>}
      {canPay && (
        <button className="primary" onClick={pay} disabled={paying} style={{ marginTop: 12 }}>
          {paying ? 'Opening payment…' : 'Pay now'}
        </button>
      )}
      {b.status === 'confirmed' && (
        <p style={{ marginTop: 12 }}>
          <Link to={'/receipt/' + b.id}>View and print receipt</Link>
        </p>
      )}
    </article>
  )
                   }
