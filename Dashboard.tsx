import { CSSProperties, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

const NAVY = '#10232f'
const GREEN = '#0f9d6e'
const AMBER = '#f59e0b'

const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: '1.1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}

const actionCard: CSSProperties = {
  ...card,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  textDecoration: 'none',
  color: '#111827',
  minHeight: 120,
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12,
      padding: '0.7rem 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <strong style={{ textAlign: 'right', wordBreak: 'break-all' }}>{value}</strong>
    </div>
  )
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
  const joined = new Date(user.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <section style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Welcome banner */}
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

      {/* Main action */}
      <Link to="/" style={{
        display: 'block', marginTop: 16, padding: '1.1rem', borderRadius: 16,
        background: GREEN, color: '#fff', textDecoration: 'none', textAlign: 'center',
        fontSize: 18, fontWeight: 700,
      }}>
        Book a seat out of Katsina
      </Link>

      {/* Shortcuts */}
      <div style={{
        display: 'grid', gap: 12, marginTop: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      }}>
        <Link to="/" style={actionCard}>
          <span style={{ fontSize: 28 }}>🚌</span>
          <strong>Passenger travel</strong>
          <small style={{ color: '#6b7280' }}>Search trips and fares</small>
        </Link>

        <div style={{ ...actionCard, opacity: 0.65 }}>
          <span style={{ fontSize: 28 }}>📦</span>
          <strong>Parcel delivery</strong>
          <small style={{ color: '#6b7280' }}>Coming soon</small>
        </div>

        <div style={{ ...actionCard, opacity: 0.65 }}>
          <span style={{ fontSize: 28 }}>🎫</span>
          <strong>My bookings</strong>
          <small style={{ color: '#6b7280' }}>Coming next</small>
        </div>
      </div>

      {/* Account details */}
      <div style={{ ...card, marginTop: 16 }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Account details</h2>
        <Row label="Username" value={username} />
        <Row label="Email" value={user.email ?? ''} />
        <Row label="Member since" value={joined} />
        <button onClick={logout} style={{
          marginTop: 14, width: '100%', padding: '0.85rem', fontSize: 16,
          fontWeight: 600, borderRadius: 12, border: '1px solid #d1d5db',
          background: '#fff', color: '#b91c1c', cursor: 'pointer',
        }}>
          Log out
        </button>
      </div>
    </section>
  )
      }
