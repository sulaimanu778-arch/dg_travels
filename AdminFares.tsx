import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { naira } from './format'

type Route = {
  id: string
  origin_city: string
  destination_city: string
  default_fare_kobo: number | null
}

export default function AdminFares() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [input, setInput] = useState<Record<string, string>>({})
  const [apply, setApply] = useState(true)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')

  const load = () =>
    supabase.from('routes')
      .select('id,origin_city,destination_city,default_fare_kobo')
      .order('destination_city')
      .then(({ data, error }) => {
        if (error) setMsg(error.message)
        else setRoutes(data as unknown as Route[])
      })

  useEffect(() => { load() }, [])

  const save = async (r: Route) => {
    const value = Math.round(Number(input[r.id]) * 100)
    if (!(value > 0)) { setMsg('Enter a fare in naira, for example 5000'); return }
    setBusy(r.id)
    setMsg('')
    const { data, error } = await supabase.rpc('admin_set_route_fare', {
      p_route: r.id, p_fare_kobo: value, p_apply_upcoming: apply,
    })
    setBusy('')
    if (error) { setMsg(error.message); return }
    setMsg('Saved ' + r.destination_city + ': ' + naira(value) + '. ' + data + ' upcoming trips updated.')
    setInput({ ...input, [r.id]: '' })
    load()
  }

  return (
    <div>
      <p>Set the fare for each destination, in naira. The waybill price follows the fare.</p>
      <label>
        <span>
          <input type="checkbox" checked={apply} onChange={e => setApply(e.target.checked)} />
          {' '}Also update trips that have not left yet
        </span>
      </label>
      {msg && <p className="notice">{msg}</p>}
      {routes.map(r => (
        <div key={r.id} className="card">
          <strong>{r.origin_city} to {r.destination_city}</strong>
          <p>Current default fare: {r.default_fare_kobo ? naira(r.default_fare_kobo) : 'not set'}</p>
          <input
            type="number" inputMode="decimal" min="1" placeholder="New fare in naira"
            value={input[r.id] ?? ''}
            onChange={e => setInput({ ...input, [r.id]: e.target.value })}
            style={{ width: '100%', padding: '.7rem', boxSizing: 'border-box', marginBottom: '.5rem' }}
          />
          <button className="primary" disabled={busy === r.id} onClick={() => save(r)}>
            {busy === r.id ? 'Saving...' : 'Save fare'}
          </button>
        </div>
      ))}
    </div>
  )
}
