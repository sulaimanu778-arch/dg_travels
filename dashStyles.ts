export const NAVY = '#10232f'
export const GREEN = '#0f9d6e'
export const AMBER = '#f59e0b'

export const css = `
@keyframes dgUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes dgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.dg-app{display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:#10232f;text-align:center;animation:dgUp .5s ease both;transition:transform .15s}
.dg-app:active{transform:scale(.92)}
.dg-app:nth-child(2){animation-delay:.08s}
.dg-app:nth-child(3){animation-delay:.16s}
.dg-app:nth-child(4){animation-delay:.24s}
.dg-ico{animation:dgFloat 3s ease-in-out infinite}
`

export const TILES = [
  { to: '/', label: 'Passenger travel', emoji: '🚌', from: '#0f9d6e', to2: '#14b8a6' },
  { to: '/waybill', label: 'Waybill delivery', emoji: '📦', from: '#d97706', to2: '#ea580c' },
  { to: '/my-bookings', label: 'My bookings', emoji: '🎫', from: '#2563eb', to2: '#38bdf8' },
  { to: '/support', label: 'Customer service', emoji: '🎧', from: '#9333ea', to2: '#ec4899' },
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
