import { useEffect, useRef, useState } from 'react'

type Props = { onScan: (text: string) => void }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDetector = (): any =>
  (window as unknown as { BarcodeDetector?: any }).BarcodeDetector

export default function ParcelScan({ onScan }: Props) {
  const [on, setOn] = useState(false)
  const [msg, setMsg] = useState('')
  const video = useRef<HTMLVideoElement>(null)
  const callback = useRef(onScan)
  callback.current = onScan

  const start = () => {
    if (!getDetector()) {
      setMsg('This browser cannot scan QR codes. Please type the code instead.')
      return
    }
    setMsg('')
    setOn(true)
  }

  useEffect(() => {
    if (!on) return
    let stream: MediaStream | null = null
    let timer = 0
    let stopped = false
    const Detector = getDetector()
    const detector = new Detector({ formats: ['qr_code'] })

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        if (stopped) {
          s.getTracks().forEach(t => t.stop())
          return
        }
        stream = s
        if (video.current) {
          video.current.srcObject = s
          video.current.play()
        }
        timer = window.setInterval(async () => {
          if (!video.current) return
          try {
            const found = await detector.detect(video.current)
            if (found.length > 0) {
              callback.current(found[0].rawValue as string)
              setOn(false)
            }
          } catch {
            // keep trying
          }
        }, 400)
      })
      .catch(() => {
        setMsg('Could not open the camera. Please allow camera access.')
        setOn(false)
      })

    return () => {
      stopped = true
      window.clearInterval(timer)
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [on])

  return (
    <div style={{ margin: '0 0 14px' }}>
      <button
        onClick={on ? () => setOn(false) : start}
        style={{
          padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontWeight: 700, background: '#10242e', color: '#fff',
        }}
      >
        {on ? 'Stop scanning' : '📷 Scan QR code'}
      </button>
      {msg && <p className="error">{msg}</p>}
      {on && (
        <video
          ref={video}
          muted
          playsInline
          style={{ width: '100%', maxWidth: 360, marginTop: 10, borderRadius: 12, display: 'block' }}
        />
      )}
    </div>
  )
}
