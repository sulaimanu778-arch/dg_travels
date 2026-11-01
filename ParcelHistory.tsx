import { useState } from 'react'
import { supabase } from './supabase'
import { lagos } from './format'

type Row = {
  id: number
  old_status: string | null
  new_status: string
  note: string | null
  created_at: string
}

const nice = (s: string | null) => (s ? s.replace(/_/g, ' ') : 'none')

export default function ParcelHistory({ parcelId }: { parcelId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const toggle = async () => {
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    setError('')
    const { data, error } = await supabase
      .from('parcel_status_history')
      .select('id,old_status,new_status,note,created_at')
      .eq('parcel_id', parcelId)
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setRows((data ?? []) as Row[])
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={toggle}
        style={{
          padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
          border: '1px solid #10242e', background: '#fff', color: '#10242e',
        }}
      >
        {open ? 'Hide history' : 'Show history'}
      </button>
      {open && error && <p className="error">{error}</p>}
      {open && !error && rows === null && <p>Loading...</p>}
      {open && rows && rows.length === 0 && <p className="empty">No history yet.</p>}
      {open && rows && rows.map(h => (
        <div key={h.id} style={{ marginTop: 6, fontSize: 14 }}>
          <strong>{nice(h.old_status)} → {nice(h.new_status)}</strong>
          <div>{lagos(h.created_at)}{h.note ? ' · ' + h.note : ''}</div>
        </div>
      ))}
    </div>
  )
}
