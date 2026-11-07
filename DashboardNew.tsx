import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import NdHeader from './NdHeader'
import NdFind from './NdFind'
import NdNav from './NdNav'
import { C, card } from './ndStyle'

const ICONS = {
  parcel: (
    <>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
      <path d="M14 6v12" />
    </>
  ),
  list: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v3H9zM9 12h6M9 16h6" />
    </>
  ),
  support: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="17" y="14" width="4" height="6" rx="1" />
    </>
  ),
}

const TILES = [
  { to: '/waybill', title: 'Send a waybill', sub: 'Ship parcels', icon: ICONS.parcel },
  { to: '/my-bookings', title: 'My tickets', sub: 'View bookings', icon: ICONS.ticket },
  { to: '/my-waybills', title: 'My waybills', sub: 'Track parcels', icon: ICONS.list },
  { to: '/support', title: 'Support', sub: 'Get help', icon: ICONS.support },
]

export default function DashboardNew() {
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

  const name =
    (user.user_metadata?.username as string | undefined) ||
    (user.email ? user.email.split('@')[0] : 'Traveller')

  return (
    <section style={{ maxWidth: 640, margin: '0 auto', paddingBottom: 96 }}>
      <NdHeader name={name} onLogout={logout} />
      <NdFind />

      <h2 style={{ fontSize: 17, margin: '22px 4px 10px', color: C.navy }}>Services</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {TILES.map(t => (
          <Link key={t.to} to={t.to} style={{
            ...card, display: 'flex', flexDirection: 'column', gap: 10,
            textDecoration: 'none', color: C.navy, padding: '1rem',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: '#E8F1FF',
              color: C.green2, display: 'grid', placeItems: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                {t.icon}
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t.title}</div>
              <div style={{ color: C.soft, fontSize: 13 }}>{t.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: '24px 0 0', opacity: 0.85 }}>
        DG Travels is part of{' '}
        <a href="https://dg-group-website.vercel.app" style={{ fontWeight: 600 }}>DG Group</a>.
      </p>

      <NdNav />
    </section>
  )
                                                                        }
