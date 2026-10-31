import { CSSProperties, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

type Row = {
  id: string
  reference: string
  seats: number
  status: string
  total_kobo: number
  created_at: string
  hold_expires_at: string | null
  trips: {
    departs_at: string
    pickup_point: string | null
    routes: { origin_city: string; destination_city: string } | null
    transport_operators: { name: string } | null
  } | null
}

type Tab = 'upcoming' | 'past' | 'cancelled'

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  confirmed: { label: 'Confirmed', bg: '#dcfce7', fg: '#166534' },
  pending_payment: { label: 'Awaiting payment', bg: '#fef3c7', fg: '#92400e' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', fg: '#991b1b' },
  expired: { label: 'Expired', bg: '#e5e7eb', fg: '#374151' },
  refunded: { label: 'Refunded', bg: '#dbeafe', fg: '#1e40af' },
}

const naira = (kobo: number) => '₦' + (kobo / 100).toLocaleString('en-NG')

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: '1.1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}

function holdPassed(b: Row) {
  return (
    b.status === 'pending_payment' &&
    b.hold_expires_at !== null &&
    new Date(b.hold_expires_at) < new Date()
  )
}

function tabOf(b: Row): Tab {
  if (['cancelled', 'expired', 'refunded'].includes(b.status) || holdPassed(b)) {
    return 'cancelled'
  }
  const departs = b.trips ? new Date(b.trips.departs_at) : null
  if (b.status === 'confirmed' && departs && departs <= new Date()) return 'past'
  return 'upcoming'
}

const EMPTY: Record<Tab, string> = {
  upcoming: 'No upcoming trips.',
  past: 'No past trips yet.',
  cancelled: 'No cancelled or expired bookings.',
}

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
          'id, reference, seats, status, total_kobo, created_at, hold_expires_at, trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name))'
        )
        .eq('user_id', s.session.user.id)
