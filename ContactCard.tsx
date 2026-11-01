import type { CSSProperties } from 'react'

const WHATSAPP = '2348024241768'
const PHONE_SHOWN = '0802 424 1768'
const PHONE_DIAL = '+2348024241768'
const EMAIL = 'sulaimanusman2138@gmail.com'
const HOURS = 'Every day, 08:00 to 12:00 (Lagos time)'

const btn: CSSProperties = {
  display: 'block', textAlign: 'center', padding: '0.85rem 1rem',
  borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none',
  color: '#fff',
}

export default function ContactCard() {
  const chat = 'https://wa.me/' + WHATSAPP + '?text=' +
    encodeURIComponent('Hello DG Travels, I need help.')

  return (
    <div className="card" style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
      <h2 style={{ margin: 0 }}>Contact us</h2>
      <a href={chat} target="_blank" rel="noopener noreferrer"
        style={{ ...btn, background: '#25d366' }}>
        Chat on WhatsApp
      </a>
      <a href={'tel:' + PHONE_DIAL} style={{ ...btn, background: '#10232f' }}>
        Call {PHONE_SHOWN}
      </a>
      <a href={'mailto:' + EMAIL} style={{ ...btn, background: '#2563eb' }}>
        Email us
      </a>
      <p style={{ margin: '4px 0 0', color: '#4b5563' }}>
        <strong>Opening hours:</strong> {HOURS}
      </p>
      <p style={{ margin: 0, color: '#4b5563', wordBreak: 'break-all' }}>
        <strong>Email:</strong> {EMAIL}
      </p>
    </div>
  )
}
