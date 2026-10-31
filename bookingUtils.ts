import type { CSSProperties } from 'react'

export type Row = {
  id: string
  reference: string
  seats: number
  status: string
  total_kobo: number
  hold_expires_at: string | null
  trips: {
    departs_at: string
    pickup_point: string | null
    routes: { origin_city: string; destination_city: string } | null
    transport_operators: { name: string } | null
  } | null
}

export type Tab = 'upcoming' | 'past' | 'cancelled'

export const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  confirmed: { label: 'Confirmed', bg: '#dcfce7', fg: '#166534' },
  pending_payment: { label: 'Awaiting payment', bg: '#fef3c7', fg: '#92400e' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', fg: '#991b1b' },
  expired: { label: 'Expired', bg: '#e5e7eb', fg: '#374151' },
  refunded: { label: 'Refunded', bg: '#dbeafe', fg: '#1e40af' },
}

export const naira = (kobo: number) =>
  '₦' + (kobo / 100).toLocaleString('en-NG')

export const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: '1.1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}

export function holdPassed(b: Row) {
  return (
    b.status === 'pending_payment' &&
    b.hold_expires_at !== null &&
    new Date(b.hold_expires_at) < new Date()
  )
}

export function tabOf(b: Row): Tab {
  if (['cancelled', 'expired', 'refunded'].includes(b.status) || holdPassed(b)) {
    return 'cancelled'
  }
  const departs = b.trips ? new Date(b.trips.departs_at) : null
  if (b.status === 'confirmed' && departs && departs <= new Date()) return 'past'
  return 'upcoming'
}
