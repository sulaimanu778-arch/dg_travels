import { ChangeEvent } from 'react'

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
  agree: boolean
  setAgree: (v: boolean) => void
}

export default function WaybillFields({ f, setF, agree, setAgree }: Props) {
  const set = (k: keyof Fields) => (e: Ev) =>
    setF(x => ({ ...x, [k]: e.target.value }))

  return (
    <>
      <label>Parcel size
        <select value={f.size} onChange={set('size')}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
      <label>Sender name
        <input required minLength={2} value={f.sender_name} onChange={set('sender_name')} />
      </label>
      <label>Sender phone
        <input required type="tel" minLength={7} value={f.sender_phone} onChange={set('sender_phone')} />
      </label>
      <label>Receiver name
        <input required minLength={2} value={f.receiver_name} onChange={set('receiver_name')} />
      </label>
      <label>Receiver phone
        <input required type="tel" minLength={7} value={f.receiver_phone} onChange={set('receiver_phone')} />
      </label>
      <label>What is in the parcel?
        <textarea required minLength={3} rows={3} value={f.description} onChange={set('description')} />
      </label>
      <label>
        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
        {' '}I confirm the parcel has no illegal, dangerous or prohibited items.
      </label>
    </>
  )
}
