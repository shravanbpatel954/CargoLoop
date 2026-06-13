import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../services/api'

export default function AuthSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { persistFromToken } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem('token', token)

    getProfile()
      .then((user) => {
        persistFromToken(token, user)
        const redirect = localStorage.getItem('postLoginRedirect') || '/app'
        localStorage.removeItem('postLoginRedirect')
        navigate(redirect, { replace: true })
      })
      .catch(() => navigate('/login', { replace: true }))
  }, [params, navigate, persistFromToken])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="mt-4 text-emerald-100/70">Signing you in…</p>
    </div>
  )
}
