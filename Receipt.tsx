import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

type Data = {
  reference: string
  seats: number
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
  booking_passengers: { full_name: string; phone: string | null }[]
  payments: { reference: string; status: string; paid_at: string | null }[]
}

const SELECT =
  'reference, seats, total_kobo, fee_kobo, charge_kobo, status, ' +
  'trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name)), ' +
  'booking_passengers(full_name, phone), payments(reference, status, paid_at)'

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
    return (
      <p className="notice">
        A receipt is only available after payment is confirmed.{' '}
        <Link to="/my-bookings">Go to My bookings</Link>
      </p>
    )
  }

  const paid = data.payments.find(p => p.status === 'success')
  const t = data.trips

  return (
    <section className="card">
      <style>{'@media print { .bar, .no-print { display: none !important } }'}</style>
      <h1>Booking receipt</h1>
      <p>Issued by DG Travels, a booking platform.</p>
      <p>Booking reference: <strong>{data.reference}</strong></p>
      <p>Route: {t.routes.origin_city} to {t.routes.destination_city}</p>
      <p>Operator: {t.transport_operators?.name ?? 'Not shown'}</p>
      <p>Departs: {lagos(t.departs_at)}</p>
      <p>Pickup point: {t.pickup_point}</p>
      <h2>Passengers ({data.seats})</h2>
      <ul>
        {data.booking_passengers.map((p, i) => (
          <li key={i}>{p.full_name}{p.phone ? ' (' + p.phone + ')' : ''}</li>
        ))}
      </ul>
      <h2>Payment</h2>
      <p>Fare: {naira(data.total_kobo)}</p>
      <p>Processing fee: {naira(data.fee_kobo ?? 0)}</p>
      <p>Total paid: <strong>{naira(data.charge_kobo ?? data.total_kobo)}</strong></p>
      {paid && <p>Payment reference: {paid.reference}</p>}
      {paid?.paid_at && <p>Paid on: {lagos(paid.paid_at)}</p>}
      <button className="primary no-print" onClick={() => window.print()}>Print receipt</button>
    </section>
  )
}
