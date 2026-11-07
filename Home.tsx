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
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
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
      {loggedIn === false && (
        <>
          <div style={{
            borderRadius: 24, padding: '1.6rem 1.2rem', color: '#fff',
            background: 'linear-gradient(135deg, #10232f, #064e3b 60%, #0f9d6e)',
          }}>
            <h1 style={{ margin: 0, color: '#fff' }}>Welcome to {BRAND}</h1>
            <p style={{ margin: '8px 0 14px' }}>
              Book a seat or send a waybill from Katsina.
            </p>
            <button className="primary" onClick={scrollToForm}>Book now</button>
          </div>
          <HomeTiles onBook={scrollToForm} />
        </>
      )}

      <div ref={formRef} className="card form" style={{ marginTop: 16 }}>
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

      <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '24px 0 90px', opacity: 0.85 }}>
        DG Travels is part of{' '}
        <a href="https://dg-group-website.vercel.app" style={{ fontWeight: 600 }}>DG Group</a>.
      </p>
    </section>
  )
    }
