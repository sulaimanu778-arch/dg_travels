import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { AMBER, GREEN, NAVY, TILES, box, icon } from './dashStyles'

export default function Dashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav('/login', { replace: true })
      else setUser(data.session.user)
    })
  }, [nav])

  const logout = async () => {
    await supabase.auth.signOut()
    nav('/login', { replace: true })
  }

  if (!user) return <p>Loading your dashboard...</p>

  const username =
    (user.user_metadata?.username as string | undefined) ||
    (user.email ? user.email.split('@')[0] : 'Traveller')

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
        }}>{username.charAt(0).toUpperCase()}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ opacity: 0.8, fontSize: 14 }}>Welcome back</div>
          <div style={{ fontSize: 24, fontWeight: 700, wordBreak: 'break-word' }}>{username}</div>
        </div>
      </div>

      <h2 style={{ margin: '22px 0 12px', fontSize: 20 }}>What would you like to do?</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {TILES.map(t => (
          <Link key={t.to} to={t.to} style={box}>
            <div style={{ ...icon, background: t.bg }}>{t.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.label}</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>{t.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 22, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
        <div>Signed in as <strong>{username}</strong></div>
        <div style={{ wordBreak: 'break-all' }}>{user.email}</div>
        <button onClick={logout} style={{
          marginTop: 10, padding: '0.45rem 1.1rem', fontSize: 14, fontWeight: 600,
          borderRadius: 999, border: '1px solid #d1d5db', background: '#fff',
          color: '#b91c1c', cursor: 'pointer',
        }}>
          Log out
        </button>
      </div>
    </section>
  )
                       }
