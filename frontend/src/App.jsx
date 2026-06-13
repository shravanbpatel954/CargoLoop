import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import PWASplashScreen from './components/PWASplashScreen'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'
import AuthSuccess from './pages/AuthSuccess'
import Dashboard from './pages/Dashboard'
import Loads from './pages/Loads'
import Vehicles from './pages/Vehicles'
import Matches from './pages/Matches'
import Analytics from './pages/Analytics'
import LiveTracking from './pages/LiveTracking'
import AdminVerification from './pages/AdminVerification'

function isStandalonePWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/app" replace />
  return children
}

function RootEntry() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/app" replace />
  if (isStandalonePWA()) return <Navigate to="/login" replace />
  return <Landing />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootEntry />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      
      {/* Both /login and /signup routes point to the same component for smooth transitions */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <AuthPage />
          </PublicOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnly>
            <AuthPage />
          </PublicOnly>
        }
      />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="loads"
          element={
            <ProtectedRoute roles={['shipper', 'admin']}>
              <Loads />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicles"
          element={
            <ProtectedRoute roles={['carrier', 'admin']}>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route path="matches" element={<Matches />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  if (!splashDone) {
    return <PWASplashScreen onComplete={() => setSplashDone(true)} />
  }

  return (
    <AuthProvider>
      <AppRoutes />
      <PWAInstallPrompt />
    </AuthProvider>
  )
}
