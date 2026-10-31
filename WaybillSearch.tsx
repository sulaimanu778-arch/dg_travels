import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

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

const CSS = `
.wb-hero{background:linear-gradient(135deg,#0a7b52,#10242e);color:#fff;border-radius:14px;padding:1.2rem;margin:1rem 0}
.wb-hero h1{margin:.2rem 0;font-size:1.7rem}.wb-hero p{margin:.3rem 0}
.wb-tag{display:inline-block;background:#e8a317;color:#10242e;font-weight:700;border-radius:999px;padding:.15rem .7rem;font-size:.85rem}
.wb h2{font-size:1.1rem;margin:1.2rem 0 .5rem}
.wb-chips{display:flex;flex-wrap:wrap;gap:.5rem}
.wb-chip{font:inherit;min-height:44px;padding:.4rem .95rem;border:1.5px solid #8a9a94;border-radius:999px;background:#fff;color:#10242e;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center}
.wb-chip.on{background:#10242e;color:#fff;border-color:#10242e}
.wb-chip span{font-size:.8rem}
.wb-select{margin-top:.6rem;width:100%;padding:.8rem;font:inherit;border:1.5px solid #8a9a94;border-radius:10px;background:#fff}
.wb-hint{color:#4a5d66;margin:1rem 0}
.wb-card{background:#fff;border:1px solid #d3dcd8;border-left:6px solid #0a7b52;border-radius:12px;padding:1rem;margin:1rem 0;box-shadow:0 2px 8px rgba(16,36,46,.08)}
.wb-card p{margin:.25rem 0}
.wb-top{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}
.wb-price{font-size:1.3rem;font-weight:800;color:#0a7b52}
.wb-bar{height:8px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin:.6rem 0 .3rem}
.wb-bar i{display:block;height:100%;background:#0a7b52}
.wb-ok{color:#0a7b52;font-weight:600}.wb-low{color:#b45309;font-weight:700}
.wb-go{display:block;margin-top:.7rem;text-align:center}
`

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
    setRows(null); setError('')
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
      else setRows((data as unknown as Row[]).filter(t => t.parcel_capacity - t.parcels_taken > 0))
    })
    return () => { stop = true }
  }, [to, date])

  return (
    <section className="wb">
      <style>{CSS}</style>
      <div className="wb-hero">
        <span className="wb-tag">Waybill delivery</span>
        <h1>Send it from Katsina</h1>
        <p>Your parcel rides on a passenger trip. Pay online first. The price is the same as the seat fare.</p>
      </div>
      <h2>1. Where is it going?</h2>
      <div className="wb-chips">
        {POPULAR.map(d => (
          <button key={d} className={'wb-chip' + (to === d ? ' on' : '')} onClick={() => setTo(d)}>{d}</button>
        ))}
      </div>
      <select className="wb-select" aria-label="More des
