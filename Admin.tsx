import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import AdminFares from './AdminFares'
import AdminAddTrip from './AdminAddTrip'
import AdminTrips from './AdminTrips'

type Tab = 'fares' | 'add' | 'trips'
const TABS: [Tab, string][] = [['fares', 'Fares'], ['add', 'Add trip'], ['trips', 'Trips']]

export default function Admin() {
  const nav = useNavigate()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('fares')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { nav('/login', { replace: true }); return }
      const { data: rows } = await supabase.from('user_roles').select('role')
        .eq('user_id', data.session.user.id).eq('role', 'admin')
      setAllowed((rows ?? []).length > 0)
    })
  }, [nav])

  if (allowed === null) return <p>Checking access...</p>
  if (!allowed) return <p className="notice">Admins only. <Link to="/dashboard">Back to dashboard</Link></p>

  return (
    <section>
      <h1>Admin</h1>
      <div style={{ display: 'flex', gap: '.5rem', margin: '1rem 0' }}>
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1, padding: '.7rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer',
              border: '1.5px solid #0a7b52',
              background: tab === key ? '#0a7b52' : '#fff',
              color: tab === key ? '#fff' : '#0a7b52',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'fares' && <AdminFares />}
      {tab === 'add' && <AdminAddTrip onAdded={() => setRefresh(refresh + 1)} />}
      {tab === 'trips' && <AdminTrips refresh={refresh} />}
    </section>
  )
      }
