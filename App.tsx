import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { configured, supabase } from './supabase'
import { BRAND } from './brand'
import Home from './Home'
import Search from './Search'
import Book from './Book'
import Auth from './Auth'
import Reset from './Reset'
import VerifyOtp from './VerifyOtp'
import Dashboard from './Dashboard'
import MyBookings from './MyBookings'
import PayReturn from './PayReturn'
import Receipt from './Receipt'
import WaybillSearch from './WaybillSearch'
import WaybillSend from './WaybillSend'
import ParcelReturn from './ParcelReturn'
import WaybillSlip from './WaybillSlip'
import Support from './Support'
import MyWaybills from './MyWaybills'
import History from './History'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const nav = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // Logged-in customers on the login page go straight to the dashboard.
  useEffect(() => {
    if (session && pathname === '/login') {
      nav('/dashboard', { replace: true })
    }
  }, [session, pathname, nav])

  return (
    <>
      <header className="bar">
        <Link to={session ? '/dashboard' : '/'} className="brand">{BRAND}</Link>
        {session ? (
          pathname !== '/dashboard' && (
            <nav>
              <Link to="/dashboard">← Dashboard</Link>
              <Link to="/history">History</Link>
            </nav>
          )
        ) : (
          <nav>
            <Link to="/">Passenger travel</Link>
            <Link to="/waybill">Waybill delivery</Link>
            <Link to="/login">Log in</Link>
          </nav>
        )}
      </header>
      <main>
        {!configured && (
          <p className="notice">
            Setup needed: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file, then restart.
          </p>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trip/:id" element={<Book session={session} />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/pay/return" element={<PayReturn />} />
          <Route path="/parcel/return" element={<ParcelReturn />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/waybill" element={<WaybillSearch />} />
          <Route path="/waybill/trip/:id" element={<WaybillSend />} />
          <Route path="/waybill/receipt/:id" element={<WaybillSlip />} />
          <Route path="/my-waybills" element={<MyWaybills />} />
          <Route path="/history" element={<History />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Go to the homepage</Link></p>} />
        </Routes>
      </main>
    </>
  )
                                                        }
