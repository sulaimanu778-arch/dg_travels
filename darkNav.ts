
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { TILES, greeting, isOpen } from './dashStyles'
import { DARK_CSS } from './darkDash'
import { useAdmin } from './useAdmin'
import RecentBookings from './RecentBookings'
import BottomNav from './BottomNav'

export default function Dashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const admin = useAdmin()

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
        <div className="dk-av">
          {username.charAt(0).toUpperCase()}
        </div>

        <div style={{ minWidth: 0 }}>
          <div className="dk-hi">{greeting()} 👋</div>
          <div className="dk-name">{username}</div>
          <div className="dk-hi">
            Travel and waybill delivery from Katsina
          </div>
        </div>
      </div>

      <Link to="/" className="dk-search">
        <span>Where are you going?</span>
        <b>🔍</b>
      </Link>

      <Link to="/support" className={'dk-pill ' + (open ? 'open' : 'shut')}>
        {open ? '● Support open now' : '● Support opens 08:00'} · every day 08:00 to 12:00
      </Link>

      <h2>Our services</h2>

      <div className="dk-tiles">
        {TILES.map(t => (
          <Link key={t.to} to={t.to} className="dk-tile">
            <div
              className="dk-ico"
              style={{
                background: `linear-gradient(145deg, ${t.from}, ${t.to2})`
              }}
            >
              {t.emoji}
            </div>
            {t.label}
          </Link>
        ))}

        {admin === 'yes' && (
          <Link to="/admin" className="dk-tile">
            <div
              className="dk-ico"
              style={{
                background: 'linear-gradient(145deg, #102b35, #075b50)'
              }}
            >
              🛡️
            </div>
            Admin
          </Link>
        )}
      </div>

      {/* Premium Waybill Promotion */}
      <Link
        to="/waybill"
        className="dk-promo"
        style={{
          color: '#ffffff',
          padding: '24px 20px',
          borderRadius: 19,
          display: 'block',
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          fontSize: 19,
          fontWeight: 900,
          color: '#ffffff'
        }}>
          📦 Need to send something?
        </div>

        <div style={{
          fontSize: 14,
          marginTop: 7,
          color: '#ffffff',
          opacity: 0.95
        }}>
          Send a waybill from Katsina ›
        </div>
      </Link>

      {/* Premium Transport Registration */}
      <Link
        to="/operator/signup"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          padding: '24px 18px',
          margin: '24px 0',
          borderRadius: 20,
          textDecoration: 'none',
          color: '#ffffff',
          background: 'linear-gradient(135deg, #102b35, #075b50)',
          border: '1px solid rgba(245,184,23,.4)',
          boxShadow: '0 8px 24px rgba(16,43,53,.16)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            minWidth: 65,
            height: 65,
            borderRadius: 18,
            background: 'linear-gradient(145deg, #ffd65a, #e5a900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36
          }}
        >
          🚌
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: '#f5b817',
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1.5,
            marginBottom: 7
          }}>
            PARTNER WITH US
          </div>

          <div style={{
            fontSize: 19,
            fontWeight: 900,
            lineHeight: 1.4,
            marginBottom: 7,
            color: '#ffffff'
          }}>
            Own a Transport Company?
          </div>

          <div style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#e1eee9',
            marginBottom: 14
          }}>
            Join Katsina Express and grow your transport business.
          </div>

          <span style={{
            display: 'inline-block',
            background: '#f5b817',
            color: '#102b35',
            padding: '11px 18px',
            borderRadius: 11,
            fontSize: 14,
            fontWeight: 900
          }}>
            REGISTER NOW →
          </span>
        </div>
      </Link>

      <h2>Recent activity</h2>

      <RecentBookings userId={user.id} />

      <div className="dk-acct">
        <div>
          Signed in as <strong>{username}</strong> · {user.email}
        </div>

        <button className="dk-out" onClick={logout}>
          Log out
        </button>
      </div>

      <BottomNav />
    </section>
  )
    }
    
