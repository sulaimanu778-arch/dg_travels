import type { CSSProperties } from 'react'

export const NAVY = '#10232f'
export const GREEN = '#0f9d6e'
export const AMBER = '#f59e0b'

export const box: CSSProperties = {
  aspectRatio: '1 / 1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  padding: '1rem',
  textAlign: 'center',
  borderRadius: 18,
  border: '1px solid #e5e7eb',
  background: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  textDecoration: 'none',
  color: '#111827',
}

export const icon: CSSProperties = {
  width: 72, height: 72, borderRadius: 18, fontSize: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export const TILES = [
  { to: '/', label: 'Passenger travel', sub: 'Book a seat out of Katsina', emoji: '🚌', bg: '#dcfce7' },
  { to: '/waybill', label: 'Waybill delivery', sub: 'Send a parcel', emoji: '📦', bg: '#fef3c7' },
  { to: '/my-bookings', label: 'My bookings', sub: 'Trips and tickets', emoji: '🎫', bg: '#dbeafe' },
  { to: '/support', label: 'Customer service', sub: 'Get help', emoji: '🎧', bg: '#fce7f3' },
]
