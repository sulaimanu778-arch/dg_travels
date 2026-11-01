
export type Tile = {
  to: string
  label: string
  emoji: string
  from: string
  to2: string
}

export const TILES: Tile[] = [
  {
    to: '/',
    label: 'Passenger travel',
    emoji: '🚌',
    from: '#f5b817',
    to2: '#d99b00',
  },
  {
    to: '/waybill',
    label: 'Waybill delivery',
    emoji: '📦',
    from: '#08734c',
    to2: '#064e3b',
  },
  {
    to: '/my-bookings',
    label: 'My bookings',
    emoji: '🎫',
    from: '#102b35',
    to2: '#1d4653',
  },
  {
    to: '/support',
    label: 'Customer service',
    emoji: '🎧',
    from: '#e8a817',
    to2: '#b77900',
  },
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
