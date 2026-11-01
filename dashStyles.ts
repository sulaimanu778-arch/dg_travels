export type Tile = {
  to: string
  label: string
  emoji: string
  from: string
  to2: string
}

export const TILES: Tile[] = [
  { to: '/', label: 'Passenger travel', emoji: '🚌', from: '#10b981', to2: '#047857' },
  { to: '/waybill', label: 'Waybill delivery', emoji: '📦', from: '#f97316', to2: '#c2410c' },
  { to: '/my-bookings', label: 'My bookings', emoji: '🎫', from: '#3b82f6', to2: '#1d4ed8' },
  { to: '/support', label: 'Customer service', emoji: '🎧', from: '#a855f7', to2: '#7e22ce' },
]

function lagosHour(): number {
  return Number(
    new Date().toLocaleString('en-GB', {
      hour: 'numeric',
      hourCycle: 'h23',
      timeZone: 'Africa/Lagos',
    }),
  )
}

export function greeting(): string {
  const h = lagosHour()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function isOpen(): boolean {
  const h = lagosHour()
  return h >= 8 && h < 12
   }
