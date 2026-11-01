import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from './supabase'

const TEXT: Record<string, string> = {
  needs_refund: 'We received your payment, but your waybill space could not be kept. Please contact support. You will be refunded.',
  amount_mismatch: 'We could not match your payment amount. Please contact support with your waybill number.',
  failed: 'Your payment was not completed. Open My waybills to try again if your space is still held.',
  abandoned: 'Your payment was not completed. Open My waybills to try again if your space is still held.',
  reversed: 'Your payment was reversed. Please contact support.',
}

export default function ParcelReturn() {
  const [params] = useSearchParams()
  const parcel = params.get('parcel')
  const [state, setState] = useState<'wait' | 'ok' | 'bad'>('wait')
  const [message, setMessage] = useState('Checking your waybill payment. Please wait...')

  useEffect(() => {
    let stop = false
    let tries = 0
    if (!parcel) {
      setState('bad')
      setMessage('This payment link is missing a waybill.')
      return
    }
    const check = async () => {
      tries += 1
      const { data } = await supabase.functions.invoke('paystack-parcel-verify', {
        body: { parcel_id: parcel },
      })
      if (stop) return
      const status: string = data?.status ?? ''
      if (status === 'confirmed') { setState('ok'); return }
      if (TEXT[status]) { setState('bad'); setMessage(TEXT[status]); return }
      if (tries >= 8) {
        setState('bad')
        setMessage('We are still waiting for confirmation from Paystack. Please check My waybills in a few minutes.')
        return
      }
      setTimeout(check, 3000)
    }
    check()
    return () => { stop = true }
  }, [parcel])

  return (
    <section className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>{state === 'ok' ? 'Payment confirmed' : state === 'bad' ? 'Payment update' : 'Please wait'}</h1>
      {state === 'ok' ? (
        <>
          <p className="notice">Your waybill payment was received. Take your parcel to the drop-off point.</p>
          <p><Link to="/my-waybills">Open My waybills</Link></p>
        </>
      ) : (
        <p className={state === 'bad' ? 'error' : 'notice'}>{message}</p>
      )}
      {state === 'bad' && <p><Link to="/my-waybills">Go to My waybills</Link></p>}
    </section>
  )
}
