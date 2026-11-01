import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import { useAdmin } from './useAdmin'
import { lagos, naira } from './format'

type Pay = {
  id: string
  reference: string
  amount_kobo: number
  booking_id: string | null
  parcel_id: string | null
  paid_at: string | null
}
type Who = { ref: string; user_id: string }
type Person = { username: string | null; full_name: string; phone: string | null }

export default function AdminRefunds() {
  const admin = useAdmin()
  const [pays, setPays] = useState<Pay[] | null>(null)
  const [who, setWho] = useState<Record<string, Who>>({})
  const [people, setPeople] = useState<Record<string, Person>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  const load = async () => {
    const { data, error } = await supabase.from('payments')
      .select('id,reference,amount_kobo,booking_id,parcel_id,paid_at')
      .eq('status', 'refund_pending').order('paid_at', { ascending: false })
    if (error) { setError(error.message); return }
    const list = (data ?? []) as Pay[]
    setPays(list)
    const map: Record<string, Who> = {}
    const bIds = list.filter(p => p.booking_id).map(p => p.booking_id as string)
    const cIds = list.filter(p => p.parcel_id).map(p => p.parcel_id as string)
    if (bIds.length) {
      const { data: b } = await supabase.from('bookings')
        .select('id,reference,user_id').in('id', bIds)
      ;(b ?? []).forEach((x: any) => { map[x.id] = { ref: x.reference, user_id: x.user_id } })
    }
    if (cIds.length) {
      const { data: c } = await supabase.from('parcels')
        .select('id,waybill_no,user_id').in('id', cIds)
      ;(c ?? []).forEach((x: any) => { map[x.id] = { ref: x.waybill_no, user_id: x.user_id } })
    }
    setWho(map)
    const uids = [...new Set(Object.values(map).map(w => w.user_id))]
    if (uids.length) {
      const { data: ps } = await supabase.from('profiles')
        .select('id,username,full_name,phone').in('id', uids)
      const pm: Record<string, Person> = {}
      ;(ps ?? []).forEach((x: any) => { pm[x.id] = x })
      setPeople(pm)
    }
  }

  useEffect(() => { if (admin === 'yes') load() }, [admin])

  const done = async (id: string) => {
    const ok = window.confirm(
      'Tap OK only AFTER you have sent the money back in Paystack. Continue?'
    )
    if (!ok) return
    setBusy(id)
    const { error } = await supabase.rpc('mark_refunded', { p_payment: id })
    setBusy('')
    if (error) setError(error.message)
    else load()
  }

  if (admin === 'checking') return <p>Checking access...</p>
  if (admin === 'no') return <p className="error">Admins only.</p>

  return (
    <section>
      <p><Link to="/admin">← Admin</Link></p>
      <h1>Refunds waiting</h1>
      <p className="notice">
        Send the money back in your Paystack dashboard first, then mark it here.
        This page does not move any money.
      </p>
      {error && <p className="error">{error}</p>}
      {pays === null && !error && <p>Loading...</p>}
      {pays?.length === 0 && <p className="empty">No refunds waiting.</p>}
      {pays?.map(p => {
        const w = who[p.booking_id ?? p.parcel_id ?? '']
        const c = w ? people[w.user_id] : undefined
        return (
          <article key={p.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.booking_id ? 'Ticket ' : 'Waybill '}{w?.ref ?? ''}</strong>
              <strong>{naira(p.amount_kobo)}</strong>
            </div>
            <div>{c ? (c.username || c.full_name) : 'Customer'}{c?.phone ? ' · ' + c.phone : ''}</div>
            <small>Paystack ref: {p.reference}{p.paid_at ? ' · paid ' + lagos(p.paid_at) : ''}</small>
            <div style={{ marginTop: 10 }}>
              <button className="primary" disabled={busy === p.id} onClick={() => done(p.id)}>
                {busy === p.id ? 'Saving...' : 'Mark as refunded'}
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
