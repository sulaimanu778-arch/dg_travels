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
  gap: 8,
  padding: '1rem',
  textAlign: 'center',
  borderRadius: 24,
  boxShadow: '0 10px 22px rgba(16,35,47,0.18)',
  textDecoration: 'none',
  color: '#fff',
}

export const icon: CSSProperties = {
  width: 70, height: 70, borderRadius: '50%', fontSize: 34,
  background: 'rgba(255,255,255,0.22)',
  border: '2px solid rgba(255,255,255,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export const TILES = [
  { to: '/', label: 'Passenger travel', sub: 'Book a seat', emoji: '🚌', from: '#0f9d6e', to2: '#14b8a6' },
  { to: '/waybill', label: 'Waybill delivery', sub: 'Send a parcel', emoji: '📦', from: '#d97706', to2: '#ea580c' },
  { to: '/my-bookings', label: 'My bookings', sub: 'Trips and tickets', emoji: '🎫', from: '#2563eb', to2: '#38bdf8' },
  { to: '/support', label: 'Customer service', sub: 'We are here to help', emoji: '🎧', from: '#9333ea', to2: '#ec4899' },
]
