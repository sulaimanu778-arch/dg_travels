import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { AMBER, GREEN, NAVY, TILES, box, icon } from './dashStyles'

const css = '.dg-tile{transition:transform .15s}.dg-tile:active{transform:scale(.95)}'

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos',
  }).format(new Date()))
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

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
      <style>{css}</style>
      <div style={{
        position: 'relative', overflow: 'hidden', color: '#fff',
        background: `linear-gradient(135deg, ${NAVY}, #1b4a5a 60%, ${GREEN})`,
        borderRadius: 24, padding: '1.5rem', borderBottom: `5px solid ${AMBER}`,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -50, width: 100, height: 100, borderRadius: '50%', background: 'rgba(245,158,11,0.18)' }} />
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: GREEN,
          border: '3px solid rgba(255,255,255,0.6)', fontSize: 30, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{username.charAt(0).toUpperCase()}</div>
        <div style={{ minWidth: 0, position: 'relative' }}>
          <div style={{ opacity: 0.85, fontSize: 14 }}>{greeting()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, wordBreak: 'break-word' }}>{username}</div>
          <div style={{ opacity: 0.8, fontSize: 13, marginTop: 2 }}>Travel and waybill delivery from Katsina</div>
        </div>
      </div>

      <h2 style={{ margin: '24px 0 12px', fontSize: 20 }}>What would you like to do?</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {TILES.map(t => (
          <Link key={t.to} to={t.to} className="dg-tile"
            style={{ ...box, background: `linear-gradient(145deg, ${t.from}, ${t.to2})` }}>
            <div style={icon}>{t.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{t.label}</div>
            <div style={{ opacity: 0.9, fontSize: 13 }}>{t.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
        <div>Signed in as <strong>{username}</strong> · {user.email}</div>
        <button onClick={logout} style={{
          marginTop: 10, padding: '0.4rem 1.1rem', fontSize: 14, fontWeight: 600,
          borderRadius: 999, border: '1px solid #d1d5db', background: '#fff',
          color: '#b91c1c', cursor: 'pointer',
        }}>
          Log out
        </button>
      </div>
    </section>
  )
            }
