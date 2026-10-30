export const naira = (kobo: number) =>
  '₦' + (kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const lagos = (iso: string) =>
  new Date(iso).toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' })

export type Trip = {
  id: string
  pickup_point: string
  departs_at: string
  estimated_arrival_at: string
  fare_kobo: number
  seat_capacity: number
  seats_taken: number
  routes: { origin_city: string; destination_city: string }
  transport_operators: { name: string } | null
}

export const TRIP_COLUMNS =
  'id,pickup_point,departs_at,estimated_arrival_at,fare_kobo,seat_capacity,seats_taken,' +
  'routes!inner(origin_city,destination_city),transport_operators(name)'
