import { FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

// Where to send the customer after the code is verified.
// We will confirm this address together in a later step.
const LOGIN_PATH = '/login'
const RESEND_SECONDS = 60

export default function VerifyOtp() {
  const nav = useNavigate()
  const location = useLocation()
  const stateEmail = (location.state as { email?: string } | null)?.email
  const [email, setEmail] = useState(
    stateEmail || sessionStorage.getItem('dg_pending_email') || ''
  )
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const [done, setDone] = useState(false)

  // Countdown for the Resend button
  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const verify = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setMsg('')
    if (!email) { setError('Please type your email address.'); return }
    if (code.length !== 6) { setError('Please enter the 6-digit code.'); return }
    setBusy(true)
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: 'signup',
    })
    if (error) {
      const m = error.message.toLowerCase()
      if (m.includes('expired') || m.includes('invalid')) {
        setError('That code is incorrect or has expired. Check the code, or tap Resend code to get a new one.')
      } else {
        setError(error.message)
      }
      setBusy(false)
      return
    }
    // Verified. Sign out so the customer logs in themselves.
    await supabase.auth.signOut()
    sessionStorage.removeItem('dg_pending_email')
    setDone(true)
    setMsg('Your email is verified. Taking you to log in...')
    setBusy(false)
    setTimeout(() => nav(LOGIN_PATH), 2000)
  }

  const resend = async () => {
    setError(''); setMsg('')
    if (!email) { setError('Please type your email address.'); return }
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() })
    if (error) {
      setError(error.message)
    } else {
      setMsg('A new code has been sent to your email.')
      setSeconds(RESEND_SECONDS)
    }
  }

  return (
    <section>
      <h1>Verify your email</h1>
      <form onSubmit={verify} className="card form">
        <p>
          {stateEmail || sessionStorage.getItem('dg_pending_email')
            ? <>We sent a 6-digit code to <strong>{email}</strong>.</>
            : 'Type your email and the 6-digit code we sent you.'}
        </p>

        {!(stateEmail || sessionStorage.getItem('dg_pending_email')) && (
          <label>Email
            <input type="email" required value={email} autoComplete="email"
              onChange={e => setEmail(e.target.value)} />
          </label>
        )}

        <label>Verification code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            placeholder="123456"
            style={{ letterSpacing: '0.4em', fontSize: '1.4rem', textAlign: 'center' }}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {msg && <p className="notice">{msg}</p>}

        <button className="primary" disabled={busy || done || code.length !== 6}>
          {busy ? 'Checking...' : 'Verify'}
        </button>

        <button type="button" className="link" onClick={resend} disabled={seconds > 0 || done}>
          {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
        </button>
      </form>
    </section>
  )
}
