import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

type P = {
  waybill_no: string
  status: string
  price_kobo: number
  size: string
  sender_name: string
  sender_phone: string
  receiver_name: string
  receiver_phone: string
  description: string
  trips: {
    departs_at: string
    pickup_point: string | null
    routes: { origin_city: string; destination_city: string } | null
    transport_operators: { name: string } | null
  } | null
}

const COLS =
  'waybill_no,status,price_kobo,size,sender_name,sender_phone,receiver_name,' +
  'receiver_phone,description,' +
  'trips(departs_at,pickup_point,routes(origin_city,destination_city),transport_operators(name))'

const PRINT_CSS =
  '@media print { .bar, .no-print { display: none !important; } ' +
  'body { background: #fff !important; } }'

function Line({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ display: 'flex', justifyContent: 'space-between', gap: 12, margin: '8px 0' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <strong style={{ textAlign: 'right' }}>{value}</strong>
    </p>
  )
}

export default function WaybillReceipt() {
  const { id } = useParams()
  const [p, setP] = useState<P | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('parcels').select(COLS).eq('id', id!).single().then(({ data, error }) => {
      if (error) setError(error.message)
      else setP(data as unknown as P)
    })
    supabase.rpc('my_parcel_code', { p_parcel_id: id }).then(({ data }) => {
      if (typeof data === 'string') setCode(data)
    })
  }, [id])

  if (error) return <p className="error">Could not load this waybill: {error}</p>
  if (!p) return <p>Loading your waybill...</p>

  const t = p.trips
  const route = t?.routes ? t.routes.origin_city + ' to ' + t.routes.destination_city : ''
  const paid = !['pending_payment', 'cancelled', 'expired'].includes(p.status)

  return (
    <section className="card">
      <style>{PRINT_CSS}</style>
      <h1>{paid ? 'Waybill confirmed' : 'Waybill not paid yet'}</h1>
      {!paid && <p className="notice">Payment has not been confirmed for this waybill.</p>}
      <Line label="Waybill number" value={p.waybill_no} />
      <Line label="Status" value={p.status.replace(/_/g, ' ')} />
      {route && <Line label="Route" value={route} />}
      {t && <Line label="Departs" value={lagos(t.departs_at)} />}
      {t?.pickup_point && <Line label="Drop-off point" value={t.pickup_point} />}
      {t?.transport_operators?.name && <Line label="Operator" value={t.transport_operators.name} />}
      <Line label="Sender" value={p.sender_name + ' (' + p.sender_phone + ')'} />
      <Line label="Receiver" value={p.receiver_name + ' (' + p.receiver_phone + ')'} />
      <Line label="Parcel" value={p.description} />
      <Line label="Price" value={naira(p.price_kobo)} />
      {paid && code && (
        <div style={{ margin: '16px 0', padding: 16, background: '#f3f4f6', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ color: '#6b7280' }}>Delivery code</div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 6 }}>{code}</div>
          <small>Keep this code safe. The receiver may be asked for it when collecting the parcel.</small>
        </div>
      )}
      <div className="no-print">
        <button className="primary" onClick={() => window.print()}>
          Print or save as PDF
        </button>
        <p><Link to="/dashboard">Back to dashboard</Link></p>
      </div>
    </section>
  )
    }
