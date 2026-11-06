
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { TILES, greeting, isOpen } from './dashStyles'
import { DARK_CSS } from './darkDash'
import { useAdmin } from './useAdmin'
import RecentBookings from './RecentBookings'
import BottomNav from './BottomNav'

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
          <span>⌂</span> Dashboard
        </Link>

        <Link to="/" className="dk-side-link">
          <span>🚌</span> Passenger travel
        </Link>

        <Link to="/waybill" className="dk-side-link">
          <span>📦</span> Waybill delivery
        </Link>

        <Link to="/my-bookings" className="dk-side-link">
          <span>🎫</span> My bookings
        </Link>

        <Link to="/my-waybills" className="dk-side-link">
          <span>🚚</span> My waybills
        </Link>

        <Link to="/support" className="dk-side-link">
          <span>🎧</span> Customer support
        </Link>

        {admin === 'yes' && (
          <>
            <div className="dk-side-label">MANAGEMENT</div>
            <Link to="/admin" className="dk-side-link">
              <span>🛡️</span> Admin panel
            </Link>
          </>
        )}

        <div className="dk-sidebar-bottom">
          <div className="dk-side-user">
            <div className="dk-av">{username.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{username}</strong>
              <small>DG Travels account</small>
            </div>
          </div>

          <button className="dk-side-logout" onClick={logout}>
            ↪ Log out
          </button>
        </div>
      </aside>

      <main className="dk-main">
        <header className="dk-topbar">
          <div>
            <div className="dk-hi">Your travel dashboard</div>
            <strong>Welcome back, {username}!</strong>
          </div>

          <div className="dk-top-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
        </header>

        <section className="dk-welcome">
          <div>
            <div className="dk-eyebrow">DG TRAVELS · KATSINA</div>
            <h1>{greeting()}, {username} 👋</h1>
            <p>
              Where would you like to go today?
              Book your journey or send a parcel with ease.
            </p>

            <Link to="/" className="dk-primary-btn">
              Explore journeys <span>→</span>
            </Link>
          </div>

          <div className="dk-welcome-art">🚌</div>
        </section>

        <section className="dk-search-panel">
          <div>
            <span className="dk-search-icon">⌕</span>
            <div>
              <strong>Plan your next journey</strong>
              <small>Find available passenger trips from Katsina</small>
            </div>
          </div>

          <Link to="/" className="dk-search-button">
            Search trips →
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
            {TILES.map(t => (
              <Link key={t.to} to={t.to} className="dk-tile">
                <div
                  className="dk-ico"
                  style={{
                    background: `linear-gradient(145deg, ${t.from}, ${t.to2})`
                  }}
                >
                  {t.emoji}
                </div>
                <strong>{t.label}</strong>
                <span className="dk-tile-arrow">Explore →</span>
              </Link>
            ))}

            {admin === 'yes' && (
              <Link to="/admin" className="dk-tile">
                <div className="dk-ico dk-admin-icon">🛡️</div>
                <strong>Admin panel</strong>
                <span className="dk-tile-arrow">Manage →</span>
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
              Book a journey →
            </Link>
          </div>
          <div className="dk-feature-art">✈️</div>
        </section>

        <section className="dk-section">
          <div className="dk-section-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Your latest bookings and deliveries</p>
            </div>
            <Link to="/history" className="dk-view-all">
              View history →
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
          <span className="dk-operator-icon">🚌</span>
          <span>
            <strong>Own a transport company?</strong>
            <small>Partner with DG Travels and register your company.</small>
          </span>
          <b>→</b>
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
            
