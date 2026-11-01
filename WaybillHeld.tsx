import { useState } from 'react'
import { supabase } from './supabase'
import { lagos, naira } from './format'

export type Held = {
  id: string
  waybill_no: string
  price_kobo: number
  hold_expires_at: string
}

async function startPayment(parcelId: string) {
  const { data, error } = await supabase.functions.invoke('paystack-init', {
    body: { parcel_id: parcelId },
  })
  let out: any = data
  if (out instanceof Blob) out = await out.text()
  if (typeof out === 'string') {
    try { out = JSON.parse(out) } catch (_e) { out = null }
  }
  if (error || !out?.url) {
    return { why: out?.error ?? error?.message ?? 'no payment link came back' }
  }
  return { url: out.url as string }
}

export default function WaybillHeld({ held }: { held: Held }) {
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const pay = async () => {
    setPaying(true)
    setError('')
    const r = await startPayment(held.id)
    if (r.url) {
      window.location.href = r.url
      return
    }
    setError('Could not start payment: ' + r.why)
    setPaying(false)
  }

  return (
    <section className="card">
      <h1>Waybill space held</h1>
      <p>Waybill number: <strong>{held.waybill_no}</strong></p>
      <p>Price {naira(held.price_kobo)}. Held until {lagos(held.hold_expires_at)}.</p>
      <p className="notice">
        Pay before the hold ends or your space is released. A small payment
        processing fee is added on the next page.
      </p>
      {error && <p className="error">{error}</p>}
      <button className="primary" onClick={pay} disabled={paying}>
        {paying ? 'Opening payment...' : 'Pay now'}
      </button>
    </section>
  )
}
