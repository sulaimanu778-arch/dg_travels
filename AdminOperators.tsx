import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'
import { lagos } from './format'

type Op = {
  id: string
  name: string
  contact_phone: string | null
  contact_email: string | null
  status: string
  approved_at: string | null
  created_at: string
}

const COLS = 'id,name,contact_phone,contact_email,status,approved_at,created_at'
const FILTERS = ['all', 'pending', 'approved', 'suspended', 'rejected']
const ACTIONS: [string, string, string][] = [
  ['approved', 'Approve', '#0a7b52'],
  ['suspended', 'Suspend', '#f59e0b'],
  ['rejected', 'Reject', '#b91c1c'],
]

export default function AdminOperators() {
  const admin = useAdmin()
  const [rows, setRows] = useState<Op[] | null>(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('transport_operators')
      .select(COLS).order('created_at', { ascending: false })
    if (error) { setError(error.message); return }
    setRows((data ?? []) as Op[])
  }, [])

  useEffect(() => {
    if (admin === 'yes') load()
  }, [admin, load])

  const change = async (id: string, status: string) => {
    setBusy(id)
    setError('')
    const { error } = await supabase.rpc('approve_operator', {
      p_operator: id,
      p_status: status,
    })
    setBusy('')
    if (error) setError(error.message)
    else load()
  }

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') return <p className="error">Admins only.</p>

  const shown = (rows ?? []).filter(o => filter === 'all' || o.status === filter)

  return (
    <section>
      <p><Link to="/admin">← Admin</Link></p>
      <h1>Operators</h1>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 14px' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontWeight: 600,
            border: '1px solid #0a7b52',
            background: filter === f ? '#0a7b52' : '#fff',
            color: filter === f ? '#fff' : '#0a7b52',
          }}>{f}</button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {!error && rows === null && <p>Loading...</p>}
      {rows && shown.length === 0 && <p className="empty">No operators here.</p>}
      {shown.map(o => (
        <article key={o.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{o.name}</strong>
            <strong>{o.status}</strong>
          </div>
          <div>{o.contact_phone || 'No phone'} · {o.contact_email || 'No email'}</div>
          <small>
            Joined {lagos(o.created_at)}
            {o.approved_at ? ' · approved ' + lagos(o.approved_at) : ''}
          </small>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {ACTIONS.filter(a => a[0] !== o.status).map(([st, label, color]) => (
              <button key={st} disabled={busy === o.id} onClick={() => change(o.id, st)}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, background: color, color: '#fff',
                }}>{label}</button>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
