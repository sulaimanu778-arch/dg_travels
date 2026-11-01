import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { AMBER, GREEN, NAVY, TILES, box, css, greeting, icon, isOpen } from './dashStyles'

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
  const open = isOpen()

  return (
    <section style={{ maxWidth: 640, margin: '0 auto' }}>
      <style>{css}</style>
      <div style={{
        position: 'relative', overflow: 'hidden', color: '#fff', borderRadius: 26,
        padding: '1.5rem', borderBottom: `5px solid ${AMBER}`,
        display: 'flex', alignItems: 'center', gap: 16,
        background: `radial-gradient(circle at 85% 20%, rgba(245,158,11,0.35), transparent 40%), radial-gradient(circle at 10% 100%, rgba(15,157,110,0.55), transparent 45%), linear-gradient(135deg, ${NAVY}, #1b4a5a)`,
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', background: GREEN, flexShrink: 0,
          border: '3px solid rgba(255,255,255,0.7)', boxShadow: '0 0 0 6px rgba(255,255,255,0.12)',
          fontSize: 32, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{username.charAt(0).toUpperCase()}</div>
        <div style={{ minWidth: 0, position: 'relative' }}>
          <div style={{ opacity: 0.85, fontSize: 14 }}>{greeting()} 👋</div>
          <div style={{ fontSize: 28, fontWeight: 800, wordBreak: 'break-word' }}>{username}</div>
          <div style={{ opacity: 0.8, fontSize: 13 }}>Travel and waybill delivery from Katsina</div>
        </div>
      </div>

      <Link to="/support" style={{
        display: 'block', textAlign: 'center', margin: '14px 0 0', padding: '0.55rem',
        borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none',
        background: open ? '#dcfce7' : '#fef3c7', color: open ? '#166534' : '#92400e',
      }}>
        {open ? '● Support open now' : '● Support opens 08:00'} · every day 08:00 to 12:00
      </Link>

      <h2 style={{ margin: '22px 0 12px', fontSize: 20 }}>What would you like to do?</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {TILES.map(t => (
          <Link key={t.to} to={t.to} className="dg-tile"
            style={{ ...box, background: `linear-gradient(145deg, ${t.from}, ${t.to2})` }}>
            <span className="dg-mark">{t.emoji}</span>
            <span className="dg-go">Open ›</span>
            <div className="dg-emoji" style={icon}>{t.emoji}</div>
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
