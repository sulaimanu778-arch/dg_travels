import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from './supabase'

export default function PayReturn() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const booking = params.get('booking')
  const parcel = params.get('parcel')
  const [message, setMessage] = useState('Checking your payment. Please wait...')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let stop = false
    let tries = 0
    const end = (text: string) => { setFailed(true); setMessage(text) }

    if (!booking && !parcel) {
      end('This payment link is missing a booking or waybill.')
      return
    }

    const check = async () => {
      tries += 1
      const body = parcel ? { parcel_id: parcel } : { booking_id: booking }
      const { data } = await supabase.functions.invoke('paystack-verify', { body })
      if (stop) return
      const status: string = data?.status ?? ''

      if (status === 'confirmed') {
        nav(parcel ? '/waybill/receipt/' + parcel : '/receipt/' + booking, { replace: true })
        return
      }
      if (status === 'needs_refund') {
        end('We received your payment, but your space could not be kept. Please contact support. You will be refunded.')
        return
      }
      if (status === 'amount_mismatch') {
        end('We could not match your payment amount. Please contact support with your reference.')
        return
      }
      if (status === 'failed' || status === 'abandoned' || status === 'reversed') {
        end('Your payment was not completed. You can go back and try again if your space is still held.')
        return
      }
      if (tries >= 8) {
        end('We are still waiting for confirmation from Paystack. Please check again in a few minutes.')
        return
      }
      setTimeout(check, 3000)
    }

    check()
    return () => { stop = true }
  }, [booking, parcel, nav])

  return (
    <section className="card">
      <h1>{failed ? 'Payment update' : 'Please wait'}</h1>
      <p className={failed ? 'error' : 'notice'}>{message}</p>
      {failed && (
        <p>
          <Link to={parcel ? '/waybill' : '/my-bookings'}>
            {parcel ? 'Back to waybill delivery' : 'Go to My bookings'}
          </Link>
        </p>
      )}
    </section>
  )
    }
