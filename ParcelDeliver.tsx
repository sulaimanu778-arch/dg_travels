import { useState } from 'react'
import { supabase } from './supabase'

type Props = { parcelId: string; status: string; onDone: () => void }

export default function ParcelDeliver({ parcelId, status, onDone }: Props) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (status !== 'arrived') return null

  const deliver = async () => {
    setBusy(true)
    setError('')
    const { error } = await supabase.rpc('mark_parcel_delivered', {
      p_parcel_id: parcelId,
      p_code: code.trim(),
    })
    setBusy(false)
    if (error) setError(error.message)
    else {
      setCode('')
      onDone()
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
        Receiver's 6-digit code
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          style={{ flex: 1, padding: 8, fontSize: 18, letterSpacing: 3 }}
        />
        <button
          onClick={deliver}
          disabled={busy || code.length !== 6}
          style={{
            padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontWeight: 700, background: '#f59e0b', color: '#10242e',
          }}
        >
          {busy ? 'Checking...' : 'Mark delivered'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
