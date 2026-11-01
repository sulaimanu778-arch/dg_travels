import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import { BRAND } from './brand'
import ReceiptCard from './ReceiptCard'

type Data = {
  reference: string
  total_kobo: number
  fee_kobo: number | null
  charge_kobo: number | null
  status: string
  trips: {
    departs_at: string
    pickup_point: string
    routes: { origin_city: string; destination_city: string }
    transport_operators: { name: string } | null
  }
  booking_passengers: { full_name: string }[]
  payments: { status: string; paid_at: string | null }[]
}

const SELECT =
  'reference, total_kobo, fee_kobo, charge_kobo, status, ' +
  'trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name)), ' +
  'booking_passengers(full_name), payments(status, paid_at)'

export default function Receipt() {
  const { id } = useParams()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('bookings').select(SELECT).eq('id', id!).single()
      .then(({ data, error }) => {
        if (error) setError('We could not find this receipt.')
        else setData(data as unknown as Data)
      })
  }, [id])

  if (error) return <p className="error">{error} <Link to="/my-bookings">My bookings</Link></p>
  if (!data) return <p>Loading receipt...</p>
  if (data.status !== 'confirmed') {
    return <p className="notice">A receipt is only available after payment. <Link to="/my-bookings">My bookings</Link></p>
  }

  const paid = data.payments.find(p => p.status === 'success')
  const t = data.trips
  const route = t.routes.origin_city + ' to ' + t.routes.destination_city
  const total = naira(data.charge_kobo ?? data.total_kobo)
  const rows: [string, string][] = [
    ['Operator', t.transport_operators?.name ?? 'Not shown'],
    ['Departs', lagos(t.departs_at)],
    ['Pickup point', t.pickup_point],
    ['Passengers', data.booking_passengers.map(p => p.full_name).join(', ')],
    ['Fare', naira(data.total_kobo)],
    ['Processing fee', naira(data.fee_kobo ?? 0)],
  ]
  if (paid?.paid_at) rows.push(['Paid on', lagos(paid.paid_at)])

  return (
    <ReceiptCard title="Passenger ticket" route={route} refLabel="Booking reference"
      refValue={data.reference} rows={rows} totalLabel="Total paid" total={total}
      shareText={BRAND + ' ticket\nRef: ' + data.reference + '\n' + route + '\nDeparts: ' + lagos(t.departs_at) + '\nPaid: ' + total} />
  )
}
