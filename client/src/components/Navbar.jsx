import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isLoggedIn, username, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false) // for the little hamburger menu on mobile

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-brand">📦 Inventory Management System</Link>
        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/suppliers" onClick={() => setMenuOpen(false)}>Suppliers</Link>

        {isLoggedIn ? (
          <>
            <span className="navbar-username">Hi, {username}</span>
            <button className="navbar-logout-btn" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Admin Login</Link>
        )}
      </div>
    </nav>
  )
}
