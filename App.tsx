import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { configured, supabase } from './supabase'
import Home from './Home'
import Search from './Search'
import Book from './Book'
import Auth from './Auth'
import Reset from './Reset'
import VerifyOtp from './VerifyOtp'
import Dashboard from './Dashboard'

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
        <Link to={session ? '/dashboard' : '/'} className="brand">DG Travels</Link>
        <nav>
          <Link to="/">Passenger travel</Link>
          <span className="soon" title="Coming next">Parcel delivery</span>
          {!session && <Link to="/login">Log in</Link>}
        </nav>
