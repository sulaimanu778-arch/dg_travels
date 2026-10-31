import { Row, STATUS, card, holdPassed, naira, when } from './bookingUtils'

export default function BookingCard({ b, who }: { b: Row; who: string }) {
  const st = holdPassed(b)
    ? { label: 'Hold expired', bg: '#e5e7eb', fg: '#374151' }
    : STATUS[b.status] ?? { label: b.status, bg: '#e5e7eb', fg: '#374151' }
  const t = b.trips
  const route = t?.routes
    ? t.routes.origin_city + ' to ' + t.routes.destination_city
    : 'Trip details unavailable'

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
    </article>
  )
}
