import { useState } from 'react'
import { supabase } from './supabase'

const NEXT: Record<string, string> = {
  paid: 'received',
  received: 'loaded',
  loaded: 'in_transit',
  in_transit: 'arrived',
}

type Props = { parcelId: string; status: string; onDone: () => void }

export default function ParcelActions({ parcelId, status, onDone }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const next = NEXT[status]

  if (!next) return null

  const move = async () => {
    setBusy(true)
    setError('')
    const { error } = await supabase.rpc('set_parcel_status', {
      p_parcel_id: parcelId,
      p_new: next,
      p_note: 'Updated by admin',
    })
    setBusy(false)
    if (error) setError(error.message)
    else onDone()
  }

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={move}
        disabled={busy}
        style={{
          padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontWeight: 700, background: '#0a7b52', color: '#fff',
        }}
      >
        {busy ? 'Saving...' : 'Mark as ' + next.replace(/_/g, ' ')}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
