import { ReactNode, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { BRAND, TAGLINE } from './brand'

type Props = {
  title: string
  route: string
  refLabel: string
  refValue: string
  rows: [string, string][]
  totalLabel: string
  total: string
  extra?: ReactNode
  shareText: string
}

const CSS = '@media print{.bar,.no-print{display:none !important}.rc{box-shadow:none !important}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'

export default function ReceiptCard(p: Props) {
  const [qr, setQr] = useState('')

  useEffect(() => {
    QRCode.toDataURL(p.refValue, { width: 240, margin: 1 })
      .then(setQr)
      .catch(() => setQr(''))
  }, [p.refValue])

  return (
    <section className="rc" style={{
      maxWidth: 440, margin: '0 auto', borderRadius: 24, overflow: 'hidden',
      background: '#fff', boxShadow: '0 12px 30px rgba(16,35,47,0.18)',
    }}>
      <style>{CSS}</style>
      <div style={{
        background: 'linear-gradient(135deg,#10232f,#064e3b)', color: '#fff',
        padding: '1.2rem', borderBottom: '5px solid #f59e0b',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic' }}>{BRAND}</div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>{TAGLINE}</div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, opacity: 0.9 }}>{p.title}</span>
          <span style={{ background: '#22c55e', padding: '4px 14px', borderRadius: 999, fontWeight: 800, letterSpacing: 1 }}>PAID</span>
        </div>
      </div>

      <div style={{ padding: '1.2rem' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#10232f', marginBottom: 6 }}>{p.route}</div>
        {p.rows.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: '#6b7280' }}>{k}</span>
            <strong style={{ textAlign: 'right', wordBreak: 'break-word' }}>{v}</strong>
          </div>
        ))}
        {p.extra}
      </div>

      <div style={{ borderTop: '2px dashed #cbd5e1', margin: '0 0.8rem' }} />

      <div style={{ padding: '1.2rem', textAlign: 'center', background: '#f8fafc' }}>
        {qr && <img src={qr} alt="QR code" width={180} height={180} />}
        <div style={{ fontSize: 13, color: '#6b7280' }}>{p.refLabel}</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>{p.refValue}</div>
        <div style={{ marginTop: 10, fontSize: 14, color: '#6b7280' }}>{p.totalLabel}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#0f9d6e' }}>{p.total}</div>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: 8, padding: '1rem' }}>
        <button className="primary" style={{ flex: 1 }} onClick={() => window.print()}>Print receipt</button>
        <a href={'https://wa.me/?text=' + encodeURIComponent(p.shareText)} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, textAlign: 'center', padding: '0.7rem', borderRadius: 10, background: '#25d366', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
          Share on WhatsApp
        </a>
      </div>
      <p style={{ margin: 0, padding: '0 1rem 1rem', textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
        Issued by {BRAND}, a booking platform.
      </p>
    </section>
  )
}
