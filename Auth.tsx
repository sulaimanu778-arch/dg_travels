import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

type Mode = 'login' | 'signup' | 'forgot'

export default function Auth() {
  const nav = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setMsg('')
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message); else nav(-1)
    } else if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (error) setError(error.message)
      else if (data.session) nav(-1)
      else setMsg('Account created. Check your email to confirm it, then log in.')
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset' })
      if (error) setError(error.message); else setMsg('If that email has an account, a reset link is on its way.')
    }
    setBusy(false)
  }

  return (
    <section>
      <h1>{mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create your account' : 'Reset your password'}</h1>
      <form onSubmit={submit} className="card form">
        {mode === 'signup' && <label>Full name<input required value={name} onChange={e => setName(e.target.value)} /></label>}
        <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        {mode !== 'forgot' && (
          <label>Password
            <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
          </label>
        )}
        {error && <p className="error">{error}</p>}
        {msg && <p className="notice">{msg}</p>}
        <button className="primary" disabled={busy}>
          {mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
        </button>
        <p>
          {mode !== 'login' && <button type="button" className="link" onClick={() => setMode('login')}>I have an account</button>}
          {mode !== 'signup' && <button type="button" className="link" onClick={() => setMode('signup')}>Create an account</button>}
          {mode !== 'forgot' && <button type="button" className="link" onClick={() => setMode('forgot')}>Forgot password</button>}
        </p>
      </form>
    </section>
  )
}
