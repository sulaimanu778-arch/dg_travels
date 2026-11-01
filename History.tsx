import { useState } from 'react'
import MyBookings from './MyBookings'
import MyWaybills from './MyWaybills'

type Tab = 'trips' | 'waybills'

const TABS: [Tab, string][] = [
  ['trips', 'Passenger trips'],
  ['waybills', 'Waybills'],
]

export default function History() {
  const [tab, setTab] = useState<Tab>('trips')

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>History</h1>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        {TABS.map(([k, name]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '0.7rem', borderRadius: 999, fontWeight: 700,
            cursor: 'pointer', border: '1px solid #d1d5db',
            background: tab === k ? '#10232f' : '#fff',
            color: tab === k ? '#fff' : '#111827',
          }}>{name}</button>
        ))}
      </div>
      {tab === 'trips' ? <MyBookings /> : <MyWaybills />}
    </section>
  )
}
