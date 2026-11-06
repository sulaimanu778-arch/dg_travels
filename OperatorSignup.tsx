import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { cleanPhone, isPhone, PHONE_MESSAGE } from './phone'

export default function OperatorSignup() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
      if (data.session?.user.email) setEmail(data.session.user.email)
    })
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isPhone(phone)) {
      setError(PHONE_MESSAGE)
      return
    }
    setBusy(true)
    setError('')
    const { error } = await supabase.rpc('register_operator', {
      p_name: name.trim(),
      p_phone: phone,
      p_email: email.trim(),
    })
    setBusy(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  if (loggedIn === null) return <p>Loading...</p>

  if (loggedIn === false) {
    return (
      <p className="notice">
        <Link to="/login">Log in or create an account</Link> first, then come back to register
        your transport company.
      </p>
    )
  }

  if (done) {
    return (
      <section className="card">
        <h1>Application sent</h1>
        <p>
          Thank you. DG Travels will check your company and approve it.
        </p>
        <p><Link to="/dashboard">Back to dashboard</Link></p>
      </section>
    )
  }

  return (
    <section>
      <h1>Register your transport company</h1>
      <form onSubmit={submit} className="card form">
        <label>Company name
          <input required minLength={2} value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>Company phone (11 digits)
          <input required type="tel" inputMode="numeric" maxLength={11}
            pattern="[0-9]{11}" title={PHONE_MESSAGE} placeholder="08012345678"
            value={phone} onChange={e => setPhone(cleanPhone(e.target.value))} />
        </label>
        <label>Company email
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>
          {busy ? 'Sending...' : 'Send application'}
        </button>
      </form>
    </section>
  )
            }
