import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from './supabase'

export default function PayReturn() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const booking = params.get('booking')
  const [message, setMessage] = useState('Checking your payment. Please wait...')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let stop = false
    let tries = 0
    const end = (text: string) => { setFailed(true); setMessage(text) }

    if (!booking) {
      end('This payment link is missing a booking.')
      return
    }

    const check = async () => {
      tries += 1
      const { data } = await supabase.functions.invoke('paystack-verify', {
        body: { booking_id: booking },
      })
      if (stop) return
      const status: string = data?.status ?? ''

      if (status === 'confirmed') {
        nav('/receipt/' + booking, { replace: true })
        return
      }
      if (status === 'needs_refund') {
        end('We received your payment, but your seats could not be kept. Please contact support. You will be refunded.')
        return
      }
      if (status === 'amount_mismatch') {
        end('We could not match your payment amount. Please contact support with your booking reference.')
        return
      }
      if (status === 'failed' || status === 'abandoned' || status === 'reversed') {
        end('Your payment was not completed. You can go to My bookings and try again if your seats are still held.')
        return
      }
      if (tries >= 8) {
        end('We are still waiting for confirmation from Paystack. Please check My bookings in a few minutes.')
        return
      }
      setTimeout(check, 3000)
    }

    check()
    return () => { stop = true }
  }, [booking, nav])

  return (
    <section className="card">
      <h1>{failed ? 'Payment update' : 'Please wait'}</h1>
      <p className={failed ? 'error' : 'notice'}>{message}</p>
      {failed && <p><Link to="/my-bookings">Go to My bookings</Link></p>}
    </section>
  )
}
