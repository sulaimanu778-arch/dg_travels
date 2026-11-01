import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import { BRAND } from './brand'

type Slip = {
  waybill_no: string
  size: string
  price_kobo: number
  status: string
  sender_name: string
  sender_phone: string
  receiver_name: string
  receiver_phone: string
  description: string
  trips: {
    departs_at: string
    pickup_point: string
    routes: { origin_city: string; destination_city: string }
    transport_operators: { name: string } | null
  }
  payments: { reference: string; status: string; paid_at: string | null }[]
}

const SELECT =
  'waybill_no, size, price_kobo, status, sender_name, sender_phone, receiver_name, receiver_phone, description, ' +
  'trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name)), ' +
  'payments(reference, status, paid_at)'

const NOT_PAID = ['pending_payment', 'expired', 'cancelled']

export default function WaybillSlip() {
  const { id } = useParams()
  const [slip, setSlip] = useState<Slip | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('parcels').select(SELECT).eq('id', id!).single()
      .then(({ data, error }) => {
        if (error) setError('We could not find this waybill.')
        else setSlip(data as unknown as Slip)
      })
    supabase.rpc('my_parcel_code', { p_parcel_id: id }).then(({ data }) => {
      if (typeof data === 'string') setCode(data)
    })
  }, [id])

  if (error) return <p className="error">{error} <Link to="/my-waybills">My waybills</Link></p>
  if (!slip) return <p>Loading waybill receipt...</p>
  if (NOT_PAID.includes(slip.status)) {
    return <p className="notice">A receipt is only available after payment. <Link to="/my-waybills">My waybills</Link></p>
  }

  const paid = slip.payments.find(p => p.status === 'success')
  const t = slip.trips

  return (
    <section className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
      <style>{'@media print { .bar, .no-print { display: none !important } }'}</style>
      <h1>Waybill receipt</h1>
      <p>Issued by {BRAND}, a booking platform.</p>
      <p>Waybill number: <strong>{slip.waybill_no}</strong></p>
      <p>Status: {slip.status.replace('_', ' ')}</p>
      <p>Route: {t.routes.origin_city} to {t.routes.destination_city}</p>
      <p>Operator: {t.transport_operators?.name ?? 'Not shown'}</p>
      <p>Departs: {lagos(t.departs_at)}</p>
      <p>Drop-off point: {t.pickup_point}</p>
      <h2>Parcel</h2>
      <p>Size: {slip.size}</p>
      <p>Items: {slip.description}</p>
      <p>From: {slip.sender_name} ({slip.sender_phone})</p>
      <p>To: {slip.receiver_name} ({slip.receiver_phone})</p>
      {code && (
        <p>Delivery code: <strong style={{ fontSize: 24, letterSpacing: 3 }}>{code}</strong><br />
          <small>Give this code to the receiver. They must show it to collect the parcel.</small></p>
      )}
      <h2>Payment</h2>
      <p>Amount paid: <strong>{naira(slip.price_kobo)}</strong></p>
      {paid && <p>Payment reference: {paid.reference}</p>}
      {paid?.paid_at && <p>Paid on: {lagos(paid.paid_at)}</p>}
      <button className="primary no-print" onClick={() => window.print()}>Print receipt</button>
    </section>
  )
}
