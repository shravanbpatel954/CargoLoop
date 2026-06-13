import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProfile, loginUser, registerUser } from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'cargoloop_auth'

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const persistAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem('token', nextToken)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }, [])

  const persistFromToken = useCallback(
    (nextToken, nextUser) => {
      persistAuth(nextToken, nextUser)
    },
    [persistAuth],
  )

  const clearAuth = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const stored = readStoredAuth()
    if (stored) setUser(stored)

    getProfile()
      .then((profile) => {
        setUser(profile)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      })
      .catch(() => clearAuth())
      .finally(() => setLoading(false))
  }, [token, clearAuth])

  const login = async (email, password) => {
    const data = await loginUser({ email, password })
    persistAuth(data.token, data.user)
    return data.user
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    persistAuth(data.token, data.user)
    return data.user
  }

  const logout = () => clearAuth()

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      persistFromToken,
      role: user?.role,
    }),
    [user, token, loading, persistFromToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
