import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import WB_CSS from './waybillStyles'

const DESTINATIONS = [
  'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Daura', 'Delta', 'Dutsinma', 'Ebonyi',
  'Edo', 'Ekiti', 'Enugu', 'Funtua', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun',
  'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Zaria',
]
const POPULAR = ['Kano', 'Kaduna', 'Abuja', 'Lagos', 'Daura', 'Zaria', 'Funtua', 'Dutsinma']
const COLS =
  'id,pickup_point,departs_at,fare_kobo,parcel_capacity,parcels_taken,' +
  'routes!inner(origin_city,destination_city),transport_operators(name)'

type Row = {
  id: string
  pickup_point: string
  departs_at: string
  fare_kobo: number
  parcel_capacity: number
  parcels_taken: number
  transport_operators: { name: string } | null
}

export default function WaybillSearch() {
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState('')

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + i * 86400000)
    const o = { timeZone: 'Africa/Lagos' } as const
    return {
      value: d.toLocaleDateString('en-CA', o),
      day: d.toLocaleDateString('en-NG', { ...o, weekday: 'short' }),
      num: d.toLocaleDateString('en-NG', { ...o, day: 'numeric', month: 'short' }),
    }
  }), [])

  useEffect(() => {
    if (!to) return
    let stop = false
    setRows(null)
    setError('')
    let start = new Date()
    let q = supabase.from('trips').select(COLS)
      .eq('status', 'published')
      .ilike('routes.origin_city', 'Katsina')
      .ilike('routes.destination_city', to)
      .order('departs_at')
    if (date) {
      const s = new Date(`${date}T00:00:00+01:00`)
      if (s > start) start = s
      q = q.lte('departs_at', `${date}T23:59:59+01:00`)
    }
    q.gt('departs_at', start.toISOString()).then(({ data, error }) => {
      if (stop) return
      if (error) setError(error.message)
      else setRows((data as unknown as Row[]).filter(t => t.parcel_capacity > t.parcels_taken))
    })
    return () => { stop = true }
  }, [to, date])

  const chip = (on: boolean) => 'wb-chip' + (on ? ' on' : '')

  return (
    <section className="wb">
      <style>{WB_CSS}</style>
      <div className="wb-hero">
        <span className="wb-tag">Waybill delivery</span>
        <h1>Send it from Katsina</h1>
        <p>Your parcel rides on a passenger trip. Pay online first. The price is the same as the seat fare.</p>
      </div>
      <h2>1. Where is it going?</h2>
      <div className="wb-chips">
        {POPULAR.map(d => (
          <button key={d} className={chip(to === d)} onClick={() => setTo(d)}>{d}</button>
        ))}
      </div>
      <select className="wb-select" value={POPULAR.includes(to) ? '' : to}
        onChange={e => setTo(e.target.value)}>
        <option value="">More destinations…</option>
        {DESTINATIONS.filter(d => !POPULAR.includes(d)).map(d => <option key={d}>{d}</option>)}
      </select>
      <h2>2. When?</h2>
      <div className="wb-chips">
        <button className={chip(date === '')} onClick={() => setDate('')}>Any date</button>
        {days.map(d => (
          <button key={d.value} className={chip(date === d.value)} onClick={() => setDate(d.value)}>
            <b>{d.day}</b><span>{d.num}</span>
          </button>
        ))}
      </div>
      {!to && <p className="wb-hint">Pick a destination to see trips.</p>}
      {to && !rows && !error && <p className="wb-hint">Looking for trips to {to}…</p>}
      {error && <p className="error">Could not load trips: {error}</p>}
      {rows?.length === 0 && <p className="wb-hint">No trips with waybill space to {to} yet. Try another day.</p>}
      {rows?.map(t => {
        const left = t.parcel_capacity - t.parcels_taken
        return (
          <article key={t.id} className="wb-card">
            <div className="wb-top">
              <strong>{t.transport_operators?.name ?? 'Operator'}</strong>
              <span className="wb-price">{naira(t.fare_kobo)}</span>
            </div>
            <p>Departs {lagos(t.departs_at)}</p>
            <p>Drop-off: {t.pickup_point}</p>
            <div className="wb-bar"><i style={{ width: (left / t.parcel_capacity * 100) + '%' }} /></div>
            <p className={left <= 2 ? 'wb-low' : 'wb-ok'}>{left <= 2 ? `Only ${left} left` : `${left} waybill spaces left`}</p>
            <Link className="primary wb-go" to={'/waybill/trip/' + t.id}>Send waybill here</Link>
          </article>
        )
      })}
    </section>
  )
                         }
