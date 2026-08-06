// keeps track of whether the admin is logged in, across the whole app
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // check localStorage first so refreshing the page doesn't log you out
  const [token, setToken] = useState(localStorage.getItem('stockkeeper_token') || null)
  const [username, setUsername] = useState(localStorage.getItem('stockkeeper_user') || null)

  function loginUser(newToken, newUsername) {
    localStorage.setItem('stockkeeper_token', newToken)
    localStorage.setItem('stockkeeper_user', newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }

  function logoutUser() {
    localStorage.removeItem('stockkeeper_token')
    localStorage.removeItem('stockkeeper_user')
    setToken(null)
    setUsername(null)
  }

  const value = {
    token,
    username,
    isLoggedIn: !!token,
    loginUser,
    logoutUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
