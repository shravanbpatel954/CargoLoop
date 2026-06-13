import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout, { AuthDivider, authInputClass, authLabelClass } from '../components/AuthLayout'
import GoogleAuthButton from '../components/GoogleAuthButton'
import { motion, AnimatePresence } from 'framer-motion'

const roles = [
  { value: 'shipper', label: 'Shipper' },
  { value: 'carrier', label: 'Carrier' },
]

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register } = useAuth()
  
  // Default to login unless the URL is explicitly /signup
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup')
  
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'shipper' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = location.state?.from || '/app'

  useEffect(() => {
    const errParam = searchParams.get('error')
    if (errParam === 'google_auth_failed') {
      setError('Google sign-in failed. Please try email instead.')
    } else if (errParam === 'account_not_found') {
      setError('Account does not exist. Please create one.')
    }
  }, [searchParams])

  const toggleMode = () => {
    const newMode = !isLogin
    setIsLogin(newMode)
    setError('')
    // Replace URL silently without remounting the layout wrapper
    navigate(newMode ? '/login' : '/signup', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        await login(form.email.trim().toLowerCase(), form.password)
      } else {
        await register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        })
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail
      if (isLogin && detail === 'Account does not exist') {
        setIsLogin(false)
        navigate('/signup', { replace: true })
        setError('Account does not exist. Please create one.')
      } else {
        setError(typeof detail === 'string' ? detail : isLogin ? 'Invalid email or password' : 'Could not create account')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={isLogin ? "Sign in" : "Create account"}
      subtitle={isLogin ? "Welcome back — pick up where you left off" : "Free to start — ship cargo or list fleet capacity"}
      footer={
        <div className="flex items-center justify-center gap-1.5">
          {isLogin ? "New here?" : "Already registered?"}
          <button 
            onClick={toggleMode}
            className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </div>
      }
    >
      <div className="glass-panel p-5 sm:p-6 rounded-3xl relative z-10 w-full overflow-hidden">
         <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {!isLogin && (
                <fieldset className="mb-4">
                  <legend className={authLabelClass}>I am a</legend>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: role.value })}
                        className={`rounded-xl border py-2 text-sm font-semibold transition-all ${
                          form.role === role.value
                            ? 'border-brand-500 bg-brand-500/10 text-brand-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                            : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <GoogleAuthButton mode={isLogin ? 'signin' : 'signup'} role={form.role} label="Continue with Google" />
              
              <AuthDivider />

              {error && (
                <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <label className="block">
                    <span className={authLabelClass}>Full name</span>
                    <input
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={authInputClass}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>
                )}

                <label className="block">
                  <span className={authLabelClass}>Email</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={authInputClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className={authLabelClass}>Password</span>
                  <input
                    required
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={isLogin ? "Your password" : "8+ chars, upper, lower, number"}
                    className={authInputClass}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </label>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(14,165,233,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 rounded-xl cursor-pointer bg-brand-500 py-2.5 sm:text-base text-sm font-bold text-white hover:bg-brand-400 disabled:opacity-60 transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                >
                  {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : (isLogin ? 'Sign in with email' : 'Create account with email')}
                </motion.button>
              </form>
            </motion.div>
         </AnimatePresence>
      </div>
    </AuthLayout>
  )
}
