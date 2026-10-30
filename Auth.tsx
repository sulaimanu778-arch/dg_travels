import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

type Mode = 'login' | 'signup' | 'forgot'

const USERNAME_RULE = /^[A-Za-z0-9_]{3,20}$/

function passwordChecks(p: string) {
  return [
    { label: 'At least 8 characters', ok: p.length >= 8 },
    { label: 'One uppercase letter (A-Z)', ok: /[A-Z]/.test(p) },
    { label: 'One lowercase letter (a-z)', ok: /[a-z]/.test(p) },
    { label: 'One number (0-9)', ok: /[0-9]/.test(p) },
    { label: 'One special character (for example @, # or !)', ok: /[^A-Za-z0-9]/.test(p) },
  ]
}

export default function Auth() {
  const nav = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [username, setUsername] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const checks = passwordChecks(password)
  const pwOk = checks.every(c => c.ok)
  const match = password === confirm
  const usernameOk = USERNAME_RULE.test(username)
  const canSignup = usernameOk && pwOk && match && confirm.length > 0 && email.length > 0

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setMsg('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('not confirmed')) {
          setError('Your email is not verified yet. Please verify it with the 6-digit code.')
          sessionStorage.setItem('dg_pending_email', email.trim())
          nav('/verify-otp', { state: { email: email.trim() } })
        } else {
          setError('Wrong email or password. Please try again.')
        }
      } else nav(-1)

    } else if (mode === 'signup') {
      if (!canSignup) { setBusy(false); return }
      const name = username.trim()
      const { data: free } = await supabase.rpc('username_available', { p_username: name })
      if (free === false) {
        setError('That username is already taken. Please choose another.')
        setBusy(false)
        return
      }
      const cleanEmail = email.trim()
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { username: name, full_name: name },
        },
      })
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setError('This email already has an account. Please log in instead.')
        } else if (error.message.toLowerCase().includes('database error')) {
          setError('That username may already be taken. Please try another.')
        } else {
          setError(error.message)
        }
      } else if (data.session) {
        nav(-1)
      } else {
        // Supabase has emailed a 6-digit code. Go to the code page.
        sessionStorage.setItem('dg_pending_email', cleanEmail)
        nav('/verify-otp', { state: { email: cleanEmail } })
      }

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
        {mode === 'signup' && (
          <label>Username
            <input required value={username} autoComplete="username"
              onChange={e => setUsername(e.target.value)} />
            <small style={{ color: usernameOk || !username ? '#6b7280' : '#b91c1c' }}>
              3 to 20 letters, numbers or underscores. No spaces.
            </small>
          </label>
        )}

        <label>Email
          <input type="email" required value={email} autoComplete="email"
            onChange={e => setEmail(e.target.value)} />
        </label>

        {mode !== 'forgot' && (
          <>
            <label>Password
              <input type={showPw ? 'text' : 'password'} required value={password}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                onChange={e => setPassword(e.target.value)} />
            </label>
            <button type="button" className="link" onClick={() => setShowPw(!showPw)}>
              {showPw ? 'Hide password' : 'Show password'}
            </button>
          </>
        )}

        {mode === 'signup' && (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
              {checks.map(c => (
                <li key={c.label} style={{ color: c.ok ? '#15803d' : '#6b7280' }}>
                  {c.ok ? '✓' : '○'} {c.label}
                </li>
              ))}
            </ul>
            <label>Confirm password
              <input type={showPw ? 'text' : 'password'} required value={confirm}
                autoComplete="new-password" onChange={e => setConfirm(e.target.value)} />
            </label>
            {confirm && !match && <p className="error">Passwords do not match.</p>}
          </>
        )}

        {error && <p className="error">{error}</p>}
        {msg && <p className="notice">{msg}</p>}

        <button className="primary" disabled={busy || (mode === 'signup' && !canSignup)}>
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
