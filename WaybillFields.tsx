import { ChangeEvent } from 'react'
import { cleanPhone, PHONE_MESSAGE } from './phone'

export const EMPTY = {
  size: 'small',
  sender_name: '',
  sender_phone: '',
  receiver_name: '',
  receiver_phone: '',
  description: '',
}
export type Fields = typeof EMPTY
type Ev = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

type Props = {
  f: Fields
  setF: (fn: (x: Fields) => Fields) => void
  agree?: boolean
  setAgree?: (v: boolean) => void
}

export default function WaybillFields({ f, setF }: Props) {
  const set = (k: keyof Fields) => (e: Ev) =>
    setF(x => ({ ...x, [k]: e.target.value }))
  const phone = (k: 'sender_phone' | 'receiver_phone') => (e: Ev) =>
    setF(x => ({ ...x, [k]: cleanPhone(e.target.value) }))

  return (
    <>
      <label>Sender name
        <input required minLength={2} value={f.sender_name} onChange={set('sender_name')} />
      </label>
      <label>Sender phone (11 digits)
        <input required type="tel" inputMode="numeric" maxLength={11}
          pattern="[0-9]{11}" title={PHONE_MESSAGE} placeholder="08012345678"
          value={f.sender_phone} onChange={phone('sender_phone')} />
      </label>
      <label>Receiver name
        <input required minLength={2} value={f.receiver_name} onChange={set('receiver_name')} />
      </label>
      <label>Receiver phone (11 digits)
        <input required type="tel" inputMode="numeric" maxLength={11}
          pattern="[0-9]{11}" title={PHONE_MESSAGE} placeholder="08012345678"
          value={f.receiver_phone} onChange={phone('receiver_phone')} />
      </label>
      <label>What is in the parcel?
        <textarea required minLength={3} rows={3} value={f.description} onChange={set('description')} />
      </label>
      <label>Parcel size
        <select value={f.size} onChange={set('size')}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    </>
  )
}
