import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'
import ProhibitedList from './ProhibitedList'

type Trip = {
  id: string; departs_at: string; fare_kobo: number; pickup_point: string
  routes: { origin_city: string; destination_city: string }
  transport_operators: { name: string } | null
}
type Held = { id: string; waybill_no: string; price_kobo: number; hold_expires_at: string }
type Key = 'sn' | 'sp' | 'rn' | 'rp'

const SIZES = [
  ['small', 'Small', 'under 2 kg'],
  ['medium', 'Medium', 'over 2 kg up to 5 kg'],
  ['large', 'Large', 'over 5 kg'],
]
const COLS = 'id,departs_at,fare_kobo,pickup_point,routes(origin_city,destination_city),transport_operators(name)'

export default function WaybillSend() {
  const { id } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [size, setSize] = useState('small')
  const [f, setF] = useState({ sn: '', sp: '', rn: '', rp: '' })
  const [desc, setDesc] = useState('')
  const [accept, setAccept] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [held, setHeld] = useState<Held | null>(null)
  const key = useRef(crypto.randomUUID())

  useEffect(() => {
    supabase.from('trips').select(COLS).eq('id', id!).single()
      .then(({ data, error }) => { if (error) setError(error.message); else setTrip(data as unknown as Trip) })
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session))
  }, [id])
  useEffect(() => { key.current = crypto.randomUUID() }, [size, desc, accept, f])

  const box = (label: string, k: Key) => (
    <label>{label}
      <input required type={k === 'sp' || k === 'rp' ? 'tel' : 'text'} minLength={k === 'sp' || k === 'rp' ? 7 : 2}
        maxLength={k === 'sp' || k === 'rp' ? 20 : 80} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />
    </label>
  )

  const hold = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError('')
    const { data, error } = await supabase.rpc('create_parcel_hold', {
      p_trip_id: id, p_size: size, p_sender_name: f.sn.trim(), p_sender_phone: f.sp.trim(),
      p_receiver_name: f.rn.trim(), p_receiver_phone: f.rp.trim(), p_description: desc.trim(),
      p_accept_terms: accept, p_idempotency_key: key.current,
    })
    setBusy(false)
    if (error) setError(error.message); else setHeld(data as Held)
  }

  const pay = async () => {
    setBusy(true); setError('')
    const { data, error } = await supabase.functions.invoke('paystack-parcel-init', { body: { parcel_id: held!.id } })
    if (error || !data?.url) { setBusy(false); setError('Could not start payment. Please try again.'); return }
    window.location.href = data.url
  }

  if (!trip) return <p>{error || 'Loading trip...'}</p>
  const head = <h1>{trip.routes.origin_city} to {trip.routes.destination_city}</h1>

  if (held) return (
    <section>{head}
      <div className="card">
        <p>Waybill <strong>{held.waybill_no}</strong> is held. Price: <strong>{naira(held.price_kobo)}</strong>.</p>
        <p>Pay before {lagos(held.hold_expires_at)} or the space is released.</p>
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy} onClick={pay}>{busy ? 'Opening payment...' : 'Pay now'}</button>
      </div>
    </section>
  )

  return (
    <section>{head}
      <p>{trip.transport_operators?.name} · departs {lagos(trip.departs_at)} · drop-off: {trip.pickup_point}</p>
      {signedIn === false && <p className="notice"><Link to="/login">Log in</Link> to send a waybill.</p>}
      <form onSubmit={hold} className="card form">
        <fieldset><legend>Size</legend>
          {SIZES.map(([v, name, kg]) => (
            <label key={v}><span><input type="radio" name="size" checked={size === v} onChange={() => setSize(v)} /> {name} ({kg})</span></label>
          ))}
        </fieldset>
        {box('Your name', 'sn')}{box('Your phone', 'sp')}{box('Receiver name', 'rn')}{box('Receiver phone', 'rp')}
        <label>What are you sending?
          <textarea required minLength={3} maxLength={300} rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
        </label>
        <ProhibitedList />
        <label><span><input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} /> I am not sending any prohibited item.</span></label>
        <p>Price: <strong>{naira(trip.fare_kobo)}</strong>. You pay online before drop-off.</p>
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy || !accept || signedIn === false}>{busy ? 'Holding space...' : 'Hold my waybill space'}</button>
      </form>
    </section>
  )
}
