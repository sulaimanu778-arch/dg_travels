import type { CSSProperties } from 'react'

export const C = {
  navy: '#10242e',
  green: '#0a7b52',
  green2: '#0f9d6e',
  amber: '#f59e0b',
  soft: '#6b7c75',
}

export const card: CSSProperties = {
  background: '#fff',
  borderRadius: 18,
  padding: '1rem',
  boxShadow: '0 4px 14px rgba(16,36,46,0.10)',
  border: '1px solid #e3e9e6',
}

export function greeting() {
  const h = Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos',
    }).format(new Date())
  )
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}
