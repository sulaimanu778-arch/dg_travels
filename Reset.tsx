import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'

export default function Reset() {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message); else setDone(true)
  }

  if (done) return <p className="notice">Password changed. <Link to="/">Continue to the homepage</Link></p>
  return (
    <section>
      <h1>Choose a new password</h1>
      <form onSubmit={submit} className="card form">
        <label>New password
          <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary">Save new password</button>
      </form>
    </section>
  )
}
