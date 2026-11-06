
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { TILES, greeting, isOpen } from './dashStyles'
import { DARK_CSS } from './darkDash'
import { useAdmin } from './useAdmin'
import RecentBookings from './RecentBookings'
import BottomNav from './BottomNav'

type IconName =
  | 'dashboard'
  | 'bus'
  | 'package'
  | 'ticket'
  | 'headset'
  | 'shield'
  | 'search'
  | 'arrow'
  | 'logout'
  | 'plane'
  | 'clock'

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...common}
    >
      {name === 'dashboard' && <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </>}
      {name === 'bus' && <>
        <rect x="3" y="4" width="18" height="15" rx="3" />
        <path d="M3 11h18M7 4v7m10-7v7M7 19v2m10-2v2" />
        <circle cx="7.5" cy="15" r="1" />
        <circle cx="16.5" cy="15" r="1" />
      </>}
      {name === 'package' && <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5" />
      </>}
      {name === 'ticket' && <>
        <path d="M4 5h16v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6V5Z" />
        <path d="M12 7v2m0 3v2m0 3v1" />
      </>}
      {name === 'headset' && <>
        <path d="M3 13v-2a9 9 0 0 1 18 0v2" />
        <rect x="3" y="12" width="4" height="7" rx="2" />
        <rect x="17" y="12" width="4" height="7" rx="2" />
        <path d="M17 19a5 5 0 0 1-5 3h-2" />
      </>}
      {name === 'shield' && <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>}
      {name === 'search' && <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </>}
      {name === 'arrow' && <path d="M5 12h14m-6-6 6 6-6 6" />}
      {name === 'logout' && <>
        <path d="M10 17l5-5-5-5m5 5H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>}
      {name === 'plane' && <>
        <path d="m3 11 18-8-7 18-3-8-8-2Z" />
        <path d="m11 13 5-5" />
      </>}
      {name === 'clock' && <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>}
    </svg>
  )
}

const SERVICE_ICONS: IconName[] = [
  'bus',
  'package',
  'ticket',
  'headset',
]

export default function Dashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const admin = useAdmin()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        nav('/login', { replace: true })
      } else {
        setUser(data.session.user)
      }
    })
  }, [nav])

  const logout = async () => {
    await supabase.auth.signOut()
    nav('/login', { replace: true })
  }

  if (!user) return <p>Loading your dashboard...</p>

  const username =
    (user.user_metadata?.username as string | undefined) ||
    (user.email ? user.email.split('@')[0] : 'Traveller')

  const open = isOpen()

  return (
    <section className="dk">
      <style>{DARK_CSS}</style>

      <aside className="dk-sidebar">
        <Link to="/dashboard" className="dk-logo">
          <span className="dk-logo-icon">DG</span>
          <span>DG Travels</span>
        </Link>

        <div className="dk-side-label">MAIN MENU</div>

        <Link to="/dashboard" className="dk-side-link active">
          <Icon name="dashboard" /> Dashboard
        </Link>

        <Link to="/" className="dk-side-link">
          <Icon name="bus" /> Passenger travel
        </Link>

        <Link to="/waybill" className="dk-side-link">
          <Icon name="package" /> Waybill delivery
        </Link>

        <Link to="/my-bookings" className="dk-side-link">
          <Icon name="ticket" /> My bookings
        </Link>

        <Link to="/my-waybills" className="dk-side-link">
          <Icon name="package" /> My waybills
        </Link>

        <Link to="/support" className="dk-side-link">
          <Icon name="headset" /> Customer support
        </Link>

        {admin === 'yes' && (
          <>
            <div className="dk-side-label">MANAGEMENT</div>
            <Link to="/admin" className="dk-side-link">
              <Icon name="shield" /> Admin panel
            </Link>
          </>
        )}

        <div className="dk-sidebar-bottom">
          <div className="dk-side-user">
            <div className="dk-av">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{username}</strong>
              <small>DG Travels account</small>
            </div>
          </div>

          <button className="dk-side-logout" onClick={logout}>
            <Icon name="logout" size={17} /> Log out
          </button>
        </div>
      </aside>

      <main className="dk-main">
        <header className="dk-topbar">
          <div>
            <div className="dk-hi">YOUR TRAVEL DASHBOARD</div>
            <strong>Welcome back, {username}</strong>
          </div>

          <div className="dk-top-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
        </header>

        <section className="dk-welcome">
          <div>
            <div className="dk-eyebrow">DG TRAVELS · KATSINA</div>
            <h1>{greeting()}, {username}</h1>
            <p>
              Where would you like to go today?
              Book your journey or send a parcel with ease.
            </p>

            <Link to="/" className="dk-primary-btn">
              Explore journeys <Icon name="arrow" size={17} />
            </Link>
          </div>

          <div className="dk-welcome-art">
            <Icon name="bus" size={90} />
          </div>
        </section>

        <section className="dk-search-panel">
          <div>
            <span className="dk-search-icon">
              <Icon name="search" size={22} />
            </span>
            <div>
              <strong>Plan your next journey</strong>
              <small>Find available passenger trips from Katsina</small>
            </div>
          </div>

          <Link to="/" className="dk-search-button">
            Search trips <Icon name="arrow" size={16} />
          </Link>
        </section>

        <section className="dk-section">
          <div className="dk-section-heading">
            <div>
              <h2>Our services</h2>
              <p>Everything you need in one place</p>
            </div>
          </div>

          <div className="dk-tiles">
            {TILES.map((t, index) => (
              <Link key={t.to} to={t.to} className="dk-tile">
                <div className="dk-ico">
                  <Icon name={SERVICE_ICONS[index]} size={25} />
                </div>
                <strong>{t.label}</strong>
                <span className="dk-tile-arrow">
                  Explore <Icon name="arrow" size={14} />
                </span>
              </Link>
            ))}

            {admin === 'yes' && (
              <Link to="/admin" className="dk-tile">
                <div className="dk-ico">
                  <Icon name="shield" size={25} />
                </div>
                <strong>Admin panel</strong>
                <span className="dk-tile-arrow">
                  Manage <Icon name="arrow" size={14} />
                </span>
              </Link>
            )}
          </div>
        </section>

        <section className="dk-feature">
          <div>
            <span className="dk-feature-tag">TRAVEL WITH CONFIDENCE</span>
            <h2>Your journey starts here.</h2>
            <p>
              Convenient passenger travel and reliable parcel delivery
              from Katsina to your destination.
            </p>
            <Link to="/" className="dk-feature-btn">
              Book a journey <Icon name="arrow" size={17} />
            </Link>
          </div>
          <div className="dk-feature-art">
            <Icon name="plane" size={65} />
          </div>
        </section>

        <section className="dk-section">
          <div className="dk-section-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Your latest bookings and deliveries</p>
            </div>
            <Link to="/history" className="dk-view-all">
              View history <Icon name="arrow" size={14} />
            </Link>
          </div>

          <RecentBookings userId={user.id} />
        </section>

        <Link to="/support" className="dk-support-status">
          <span>{open ? '●' : '○'}</span>
          {open ? 'Customer support is open' : 'Customer support opens at 08:00'}
          <small>Every day · 08:00 to 12:00</small>
        </Link>

        <Link to="/operator/signup" className="dk-operator">
          <span className="dk-operator-icon">
            <Icon name="bus" size={28} />
          </span>
          <span>
            <strong>Own a transport company?</strong>
            <small>Partner with DG Travels and register your company.</small>
          </span>
          <b><Icon name="arrow" size={20} /></b>
        </Link>

        <footer className="dk-footer">
          Signed in as {username} · {user.email}
          <button onClick={logout}>Log out</button>
        </footer>
      </main>

      <BottomNav />
    </section>
  )
      }
          
