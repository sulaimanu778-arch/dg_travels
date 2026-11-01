import { useState } from 'react'
import { supabase } from './supabase'
import ParcelScan from './ParcelScan'

type Item = { id: string; waybill_no: string; status: string; receiver_name: string }
type Props = { parcels: Item[]; onDone: () => void }
type Found = { item: Item; code: string }

export default function ParcelScanBox({ parcels, onDone }: Props) {
  const [found, setFound] = useState<Found | null>(null)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)

  const handle = (text: string) => {
    setMsg('')
    setOk('')
    setFound(null)
    if (!text.startsWith('KEP:')) {
      setMsg('This QR is not a Katsina Express waybill.')
      return
    }
    const rest = text.slice(4)
    const i = rest.lastIndexOf(':')
    const waybill = rest.slice(0, i)
    const code = rest.slice(i + 1)
    const item = parcels.find(p => p.waybill_no === waybill)
    if (i < 0 || !item) {
      setMsg('Parcel ' + (waybill || 'unknown') + ' was not found in the list.')
      return
    }
    if (item.status !== 'arrived') {
      setMsg(
        item.waybill_no + ' is "' + item.status.replace(/_/g, ' ') +
        '", not arrived yet. Move it to arrived first.'
      )
      return
    }
    setFound({ item, code })
  }

  const confirm = async () => {
    if (!found) return
    setBusy(true)
    const { error } = await supabase.rpc('mark_parcel_delivered', {
      p_parcel_id: found.item.id,
      p_code: found.code,
    })
    setBusy(false)
    if (error) {
      setMsg(error.message)
      return
    }
    setOk(found.item.waybill_no + ' marked as delivered.')
    setFound(null)
    onDone()
  }

  return (
    <div className="card">
      <strong>Confirm delivery by QR</strong>
      <ParcelScan onScan={handle} />
      {msg && <p className="error">{msg}</p>}
      {ok && <p className="notice">{ok}</p>}
      {found && (
        <div>
          <p>
            Waybill <strong>{found.item.waybill_no}</strong>
            <br />
            Receiver: <strong>{found.item.receiver_name}</strong>
          </p>
          <button
            onClick={confirm}
            disabled={busy}
            style={{
              padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, background: '#f59e0b', color: '#10242e',
            }}
          >
            {busy ? 'Saving...' : 'Confirm delivery'}
          </button>
        </div>
      )}
    </div>
  )
}
