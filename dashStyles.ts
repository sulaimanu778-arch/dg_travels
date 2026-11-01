import type { CSSProperties } from 'react'

export const NAVY = '#10232f'
export const GREEN = '#0f9d6e'
export const AMBER = '#f59e0b'

export const css = `
@keyframes dgUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes dgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.dg-tile{position:relative;overflow:hidden;animation:dgUp .5s ease both;transition:transform .15s}
.dg-tile:active{transform:scale(.95)}
.dg-tile:nth-child(2){animation-delay:.08s}
.dg-tile:nth-child(3){animation-delay:.16s}
.dg-tile:nth-child(4){animation-delay:.24s}
.dg-emoji{animation:dgFloat 3s ease-in-out infinite}
.dg-mark{position:absolute;right:-14px;bottom:-22px;font-size:110px;opacity:.16}
.dg-go{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.25);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
`

export const box: CSSProperties = {
  aspectRatio: '1 / 1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '1rem',
  textAlign: 'center',
  borderRadius: 26,
  boxShadow: '0 12px 24px rgba(16,35,47,0.22)',
  textDecoration: 'none',
  color: '#fff',
}

export const icon: CSSProperties = {
  width: 72, height: 72, borderRadius: '50%', fontSize: 34,
  background: 'rgba(255,255,255,0.22)',
  border: '2px solid rgba(255,255,255,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export const TILES = [
  { to: '/', label: 'Passenger travel', sub: 'Book a seat', emoji: '🚌', from: '#0f9d6e', to2: '#14b8a6' },
  { to: '/waybill', label: 'Waybill delivery', sub: 'Send a parcel', emoji: '📦', from: '#d97706', to2: '#ea580c' },
  { to: '/my-bookings', label: 'My bookings', sub: 'Trips and tickets', emoji: '🎫', from: '#2563eb', to2: '#38bdf8' },
  { to: '/support', label: 'Customer service', sub: 'We are here to help', emoji: '🎧', from: '#9333ea', to2: '#ec4899' },
]

function lagosHour() {
  return Number(new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos',
  }).format(new Date()))
}

export function greeting() {
  const h = lagosHour()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export function isOpen() {
  const h = lagosHour()
  return h >= 8 && h < 12
                }
