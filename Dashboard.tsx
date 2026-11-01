import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { TILES, greeting, isOpen } from './dashStyles'
import { DARK_CSS } from './darkDash'
import RecentBookings from './RecentBookings'
import BottomNav from './BottomNav'

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
    <section className="dk">
      <style>{DARK_CSS}</style>

      <div className="dk-hero">
        <div className="dk-av">{username.charAt(0).toUpperCase()}</div>
        <div style={{ minWidth: 0 }}>
          <div className="dk-hi">{greeting()} 👋</div>
          <div className="dk-name">{username}</div>
          <div className="dk-hi">Travel and waybill delivery from Katsina</div>
        </div>
      </div>

      <Link to="/" className="dk-search">
        <span>Where are you going?</span>
        <b>🔍</b>
      </Link>

      <Link to="/support" className={'dk-pill ' + (open ? 'open' : 'shut')}>
        {open ? '● Support open now' : '● Support opens 08:00'} · every day 08:00 to 12:00
      </Link>

      <h2>Recent activity</h2>
      <RecentBookings userId={user.id} />

      <h2>Our services</h2>
      <div className="dk-tiles">
        {TILES.map(t => (
          <Link key={t.to} to={t.to} className="dk-tile">
            <div
              className="dk-ico"
              style={{ background: `linear-gradient(145deg, ${t.from}, ${t.to2})` }}
            >
              {t.emoji}
            </div>
            {t.label}
          </Link>
        ))}
      </div>

      <Link to="/waybill" className="dk-promo">
        <div style={{ fontSize: 18, fontWeight: 800 }}>📦 Need to send something?</div>
        <div style={{ opacity: 0.92, fontSize: 14, marginTop: 2 }}>Send a waybill from Katsina ›</div>
      </Link>

      <div className="dk-acct">
        <div>Signed in as <strong>{username}</strong> · {user.email}</div>
        <button className="dk-out" onClick={logout}>Log out</button>
      </div>

      <BottomNav />
    </section>
  )
      }
