import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { supabase } from './supabase'
import { BRAND } from './brand'
import { lagos, naira } from './format'

type Data = {
  reference: string
  seats: number
  total_kobo: number
  fee_kobo: number | null
  charge_kobo: number | null
  status: string
  trips: {
    departs_at: string
    pickup_point: string
    routes: { origin_city: string; destination_city: string }
    transport_operators: { name: string } | null
  }
  booking_passengers: { full_name: string; phone: string | null }[]
  payments: { reference: string; status: string; paid_at: string | null }[]
}

const SELECT =
  'reference, seats, total_kobo, fee_kobo, charge_kobo, status, ' +
  'trips(departs_at, pickup_point, routes(origin_city, destination_city), transport_operators(name)), ' +
  'booking_passengers(full_name, phone), payments(reference, status, paid_at)'

const CSS = `
.rc{max-width:560px;margin:1rem auto;background:#fff;border:1px solid #d9e3dd;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(16,36,46,.1);color:#10242e}
.rc-head{background:linear-gradient(135deg,#0a7b52,#0f5a3d);color:#fff;padding:1.2rem;display:flex;justify-content:space-between;align-items:center;gap:1rem}
.rc-head h1{margin:0;font-size:1.3rem}
.rc-head small{opacity:.85}
.rc-paid{background:#e8a317;color:#10242e;font-weight:800;border-radius:999px;padding:.3rem .8rem;font-size:.85rem}
.rc-body{padding:1.2rem}
.rc-ref{text-align:center;padding:1rem;background:#f6f8f5;border-radius:12px}
.rc-ref b{display:block;font-size:1.6rem;letter-spacing:.08em;margin:.2rem 0}
.rc-ref img{width:180px;height:180px;margin-top:.5rem}
.rc h2{font-size:1rem;margin:1.2rem 0 .4rem;color:#0a7b52;text-transform:uppercase;letter-spacing:.05em}
.rc-row{display:flex;justify-content:space-between;gap:1rem;padding:.45rem 0;border-bottom:1px solid #e3ebe6}
.rc-row span{color:#4a5d66}
.rc-row b{text-align:right}
.rc-total{font-size:1.15rem;color:#0a7b52}
.rc ul{margin:0;padding-left:1.2rem}
.rc-note{margin-top:1rem;font-size:.85rem;color:#4a5d66;text-align:center}
.rc-btns{display:flex;gap:.6rem;margin-top:1rem}
.rc-btns button{flex:1}
@media print{.bar,.no-print{display:none!important}.rc{box-shadow:none;border:1px solid #999}}
`

function Row({ k, v, cls }: { k: string; v: string; cls?: string }) {
  return <div className="rc-row"><span>{k}</span><b className={cls}>{v}</b></div>
}

export default function Receipt() {
  const { id } = useParams()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const [qr, setQr] =
