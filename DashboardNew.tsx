import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import NdHeader from './NdHeader'
import NdFind from './NdFind'
import NdRecent from './NdRecent'
import NdNav from './NdNav'
import { C, card } from './ndStyle'

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
      <NdHeader name={name} />
      <NdFind />
      <Link to="/waybill" style={{
        ...card, display: 'flex', alignItems: 'center', gap: 12, marginTop: 14,
        textDecoration: 'none', color: C.navy,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: '#fef3c7',
          display: 'grid', placeItems: 'center', fontSize: 22,
        }}>📦</div>
        <div style={{ flex: 1 }}>
          <strong>Send a waybill</strong>
          <div style={{ color: C.soft, fontSize: 13 }}>Ship packages from Katsina</div>
        </div>
        <span style={{ color: C.soft, fontSize: 22 }}>›</span>
      </Link>
      <NdRecent userId={user.id} />
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={logout} style={{
          padding: '0.45rem 1.2rem', borderRadius: 999, border: '1px solid #d1d5db',
          background: '#fff', color: '#b91c1c', fontWeight: 600, cursor: 'pointer',
        }}>Log out</button>
      </div>
      <NdNav />
    </section>
  )
}
