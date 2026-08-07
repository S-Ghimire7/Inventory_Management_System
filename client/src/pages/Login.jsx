import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Please fill in both fields')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await loginRequest(usernameInput.trim(), passwordInput)
      loginUser(result.token, result.username)
      navigate('/')
    } catch (err) {
      setErrorMsg(err.message || 'Login failed, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container login-page">
      <div className="login-box">
        <h1>Admin Login</h1>
        <p className="login-subtext">Log in to manage products and suppliers</p>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="login-hint">Default demo account: admin / admin123</p>
      </div>
    </div>
  )
}
