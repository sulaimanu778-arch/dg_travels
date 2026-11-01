import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos } from './format'
import ContactCard from './ContactCard'

type Msg = { id: string; subject: string; status: string; created_at: string }

const LABEL: Record<string, string> = {
  open: 'Received',
  in_progress: 'Being handled',
  closed: 'Closed',
}

export default function Support() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [list, setList] = useState<Msg[]>([])
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase.from('support_requests')
      .select('id,subject,status,created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    setList((data as Msg[] | null) ?? [])
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
      if (data.session) load()
    })
  }, [load])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setDone(false)
    const { error } = await supabase.from('support_requests').insert({
      subject: subject.trim(),
      message: message.trim(),
    })
    setBusy(false)
    if (error) {
      setError('We could not send your message. Please try again.')
    } else {
      setDone(true); setSubject(''); setMessage('')
      load()
    }
  }

  if (loggedIn === null) return <p>Loading...</p>

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>Customer service</h1>
      <ContactCard />
      {!loggedIn ? (
        <p className="notice"><Link to="/login">Log in</Link> to send us a message here.</p>
      ) : (
        <>
          <h2>Send us a message</h2>
          <form onSubmit={send} className="card form">
            <label>Subject
              <input required minLength={3} maxLength={150} value={subject}
                onChange={e => setSubject(e.target.value)} />
            </label>
            <label>Message
              <textarea required minLength={5} maxLength={4000} rows={5} value={message}
                onChange={e => setMessage(e.target.value)} />
            </label>
            {error && <p className="error">{error}</p>}
            {done && <p className="notice">Your message was received. We will reply as soon as we can.</p>}
            <button className="primary" disabled={busy}>{busy ? 'Sending...' : 'Send message'}</button>
          </form>

          {list.length > 0 && (
            <>
              <h2>Your messages</h2>
              {list.map(m => (
                <article key={m.id} className="card" style={{ marginBottom: 10 }}>
                  <strong>{m.subject}</strong>
                  <p>{LABEL[m.status] ?? m.status} · {lagos(m.created_at)}</p>
                </article>
              ))}
            </>
          )}
        </>
      )}
    </section>
  )
}
