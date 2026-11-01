import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import { BRAND } from './brand'
import ReceiptCard from './ReceiptCard'

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
  payments: { status: string; paid_at: string | null }[]
}

const SELECT =
  'waybill_no, size, price_kobo, status, sender_name, sender_phone, receiver_name, receiver_phone, description, ' +
  'trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name)), ' +
  'payments(status, paid_at)'

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
  const route = t.routes.origin_city + ' to ' + t.routes.destination_city
  const total = naira(slip.price_kobo)
  const rows: [string, string][] = [
    ['Operator', t.transport_operators?.name ?? 'Not shown'],
    ['Departs', lagos(t.departs_at)],
    ['Drop-off point', t.pickup_point],
    ['Size', slip.size],
    ['Items', slip.description],
    ['From', slip.sender_name + ' (' + slip.sender_phone + ')'],
    ['To', slip.receiver_name + ' (' + slip.receiver_phone + ')'],
  ]
  if (paid?.paid_at) rows.push(['Paid on', lagos(paid.paid_at)])

  const extra = code ? (
    <div style={{ marginTop: 14, padding: '0.8rem', background: '#fef3c7', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 13, color: '#92400e' }}>Delivery code for the receiver</div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6 }}>{code}</div>
    </div>
  ) : null

  return (
    <ReceiptCard title="Waybill delivery" route={route} refLabel="Waybill number"
      refValue={slip.waybill_no} rows={rows} totalLabel="Amount paid" total={total} extra={extra}
      shareText={BRAND + ' waybill\nNo: ' + slip.waybill_no + '\n' + route + '\nDeparts: ' + lagos(t.departs_at) + '\nPaid: ' + total} />
  )
      }
