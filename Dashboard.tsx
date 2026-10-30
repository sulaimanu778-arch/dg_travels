import { CSSProperties, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

const NAVY = '#10232f'
const GREEN = '#0f9d6e'
const AMBER = '#f59e0b'

const choice: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '1.4rem',
  borderRadius: 18,
  border: '1px solid #e5e7eb',
  background: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  textDecoration: 'none',
  color: '#111827',
}

const iconBox: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 32,
  flexShrink: 0,
}

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
    (user.email ? user.email.split('@')[0] : 'Traveller')
  const initial = username.charAt(0).toUpperCase()

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{
        background: `linear-gradient(135deg, ${NAVY}, #1b4a5a)`,
        color: '#fff', borderRadius: 20, padding: '1.4rem',
        display: 'flex', alignItems: 'center', gap: 16,
        borderBottom: `4px solid ${AMBER}`,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: GREEN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, flexShrink: 0,
        }}>{initial}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ opacity: 0.8, fontSize: 14 }}>Welcome back</div>
          <div style={{ fontSize: 24, fontWeight: 700, wordBreak: 'break-word' }}>{username}</div>
        </div>
      </div>

      <h2 style={{ margin: '22px 0 12px', fontSize: 20 }}>What would you like to do?</h2>

      <div style={{ display: 'grid', gap: 14 }}>
        <Link to="/" style={choice}>
          <div style={{ ...iconBox, background: '#dcfce7' }}>🚌</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Passenger travel</div>
            <div style={{ color: '#6b7280', marginTop: 2 }}>Book a seat out of Katsina</div>
          </div>
        </Link>

        <div style={{ ...choice, opacity: 0.7, cursor: 'not-allowed' }}>
          <div style={{ ...iconBox, background: '#fef3c7' }}>📦</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Parcel delivery</div>
            <div style={{ color: '#6b7280', marginTop: 2 }}>Coming soon</div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 22, padding: '1rem 1.2rem', background: '#fff',
        border: '1px solid #e5e7eb', borderRadius: 16,
      }}>
        <div style={{ color: '#6b7280', fontSize: 14 }}>Signed in as</div>
        <div style={{ fontWeight: 700 }}>{username}</div>
        <div style={{ color: '#6b7280', wordBreak: 'break-all' }}>{user.email}</div>
        <button onClick={logout} style={{
          marginTop: 12, width: '100%', padding: '0.85rem', fontSize: 16,
          fontWeight: 600, borderRadius: 12, border: '1px solid #d1d5db',
          background: '#fff', color: '#b91c1c', cursor: 'pointer',
        }}>
          Log out
        </button>
      </div>
    </section>
  )
      }
