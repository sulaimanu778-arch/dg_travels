import { CSSProperties, FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { DESTINATIONS } from './places'
import { BRAND } from './brand'
import HomeTiles from './HomeTiles'

const field: CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '0.9rem 1rem', fontSize: '1rem',
  fontFamily: 'inherit', border: '1px solid #9ca3af', borderRadius: 10,
  background: '#fff', color: '#111827',
}

export default function Home() {
  const nav = useNavigate()
  const formRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      if (!u) return
      setName((u.user_metadata?.username as string | undefined) || (u.email ? u.email.split('@')[0] : ''))
    })
  }, [])

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' })

  const go = (e: FormEvent) => {
    e.preventDefault()
    if (!to) return
    const q = new URLSearchParams({ from: 'Katsina', to, seats: String(seats) })
    if (date) q.set('date', date)
    nav('/search?' + q.toString())
  }

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: 24, padding: '2.2rem 1rem',
        background: 'linear-gradient(135deg, #10232f, #064e3b 60%, #0f9d6e)',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(245,158,11,0.3)' }} />
        <div style={{ position: 'absolute', left: -30, bottom: -50, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{
          position: 'relative', background: 'rgba(255,255,255,0.93)', borderRadius: 18, padding: '1.4rem',
        }}>
          <h1 style={{ margin: 0 }}>Hello{name ? ', ' + name : ''}</h1>
          <p style={{ margin: '8px 0 14px' }}>
            Where would you like to travel next? {BRAND} will take you there.
          </p>
          <button className="primary" onClick={scrollToForm}>Book now</button>
        </div>
      </div>

      <HomeTiles onBook={scrollToForm} />

      <div ref={formRef} className="card form" style={{ marginTop: 24 }}>
        <h2 style={{ margin: 0 }}>Book a seat out of Katsina</h2>
        <form onSubmit={go} className="form">
          <label>From
            <input value="Katsina" readOnly disabled style={field} />
          </label>
          <label>To
            <select value={to} onChange={e => setTo(e.target.value)} required style={field}>
              <option value="">Select destination</option>
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label>Travel date (optional)
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={field} />
          </label>
          <label>Number of passengers
            <select value={seats} onChange={e => setSeats(Number(e.target.value))} style={field}>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
              ))}
            </select>
          </label>
          <button className="primary" disabled={!to}>Search Journeys</button>
        </form>
      </div>
    </section>
  )
  }
