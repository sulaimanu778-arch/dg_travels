import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

const tile = {
  display: 'block',
  padding: '1.1rem',
  border: '1px solid #d1d5db',
  borderRadius: '12px',
  background: '#fff',
  color: '#111827',
  textDecoration: 'none',
} as const

export default function Dashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        nav('/login', { replace: true })
      } else {
        setUser(data.session.user)
        setChecking(false)
      }
    })
  }, [nav])

  const logout = async () => {
    await supabase.auth.signOut()
    nav('/login', { replace: true })
  }

  if (checking || !user) return <p>Loading your dashboard...</p>

  const username =
    (user.user_metadata?.username as string | undefined) ||
    (user.email ? user.email.split('@')[0] : 'there')

  return (
    <section>
      <h1>Welcome, {username}</h1>
      <p className="lead">What would you like to do today?</p>

      <div style={{ display: 'grid', gap: '0.9rem', margin: '1rem 0' }}>
        <Link to="/" style={tile}>
          <strong>Book passenger travel</strong>
          <div>Find a trip out of Katsina and hold your seat.</div>
        </Link>

        <div style={{ ...tile, opacity: 0.6 }}>
          <strong>Send a parcel</strong>
          <div>Coming soon.</div>
        </div>

        <div style={{ ...tile, opacity: 0.6 }}>
          <strong>My bookings</strong>
          <div>Coming next.</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Account details</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button className="link" onClick={logout}>Log out</button>
      </div>
    </section>
  )
                                    }
