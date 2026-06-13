const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function startGoogleAuth({ role = 'shipper', mode = 'signin' } = {}) {
  localStorage.setItem('postLoginRedirect', '/app')
  window.location.href = `${API_BASE}/auth/google?role=${role}&mode=${mode}`
}
