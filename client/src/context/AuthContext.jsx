import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('invapp_token') || null)
  const [username, setUsername] = useState(localStorage.getItem('invapp_user') || null)

  function loginUser(newToken, newUsername) {
    localStorage.setItem('invapp_token', newToken)
    localStorage.setItem('invapp_user', newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }

  function logoutUser() {
    localStorage.removeItem('invapp_token')
    localStorage.removeItem('invapp_user')
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
