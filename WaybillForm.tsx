import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import { lagos, naira } from './format'

const COLS =
  'id,pickup_point,departs_at,fare_kobo,parcel_capacity,parcels_taken,' +
  'routes!inner(origin_city,destination_city),transport_operators(name)'

type TripRow = {
  id: string
  pickup_point: string
  departs_at: string
  fare_kobo: number
  parcel_capacity: number
  parcels_taken: number
  routes: { origin_city: string; destination_city: string }
  transport_operators: { name: string } | null
}
type Held = { id: string; waybill_no: string; price_kobo: number; hold_expires_at: string }
type Field = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

const EMPTY = {
  size: 'small', sender_name: '', sender_phone: '',
  receiver_name: '', receiver_phone: '', description: '',
}

export default function WaybillForm() {
  const { id } = useParams()
  const [trip, setTrip] = useState<TripRow | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [f, setF] = useState(EMPTY)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [paying, setPaying] = useState(false)
  const [held, setHeld] = useState<Held | null>(null)
  const key = useRef(crypto.randomUUID())

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    supabase.from('trips').select(COLS).eq('id', id!).single().then(({ data, error }) => {
      if (error) setError(error.message)
      else setTrip(data as unknown as TripRow)
    })
  }, [id])

  // a changed form is a new request, so it gets a new duplicate-protection key
  useEffect(() => { key.current = crypto.randomUUID() }, [JSON.stringify(f), agree])

  const set = (k: keyof typeof EMPTY) => (e: Field) =>
    setF(x => ({ ...x, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { data, error } = await supabase.rpc('create_parcel_hold', {
      p_trip_id: id, p_size: f.size,
      p_sender_name: f.sender_name, p_sender_phone: f.sender_phone,
      p_receiver_name: f.receiver_name, p_receiver_phone: f.receiver_phone,
      p_description: f.description, p_accept_terms: agree,
      p_idempotency_key: key.current,
    })
    setBusy(false)
    if (error) setError(error.message)
    else setHeld(data as Held)
  }

  const pay = async () => {
    if (!held) return
    setPaying(true)
    setError('')
    const { data, error } = await supabase.functions.invoke('paystack-init', {
      body: { parcel_id: held.id },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let out: any = data
    if (out instanceof Blob) out = await out.text()
    if (typeof out === 'string') {
      try { out = JSON.parse(out) } catch (_e) { /* keep as
