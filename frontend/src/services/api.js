import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't intercept 401s for login/register endpoints
    if (error.config && error.config.url && error.config.url.startsWith('/auth/')) {
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('cargoloop_auth')
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth'
      }
    }
    return Promise.reject(error)
  },
)

export const registerUser = (payload) => api.post('/auth/register', payload).then((r) => r.data)
export const loginUser = (payload) => api.post('/auth/login', payload).then((r) => r.data)
export const getProfile = () => api.get('/auth/me').then((r) => r.data)

export const getLoads = () => api.get('/loads').then((r) => r.data)
export const createLoad = (payload) => api.post('/loads', payload).then((r) => r.data)
export const getVehicles = () => api.get('/vehicles').then((r) => r.data)
export const createVehicle = (payload) => api.post('/vehicles', payload).then((r) => r.data)
export const generateMatch = (loadId) =>
  api.post('/matches/generate', { loadId }).then((r) => r.data)
export const getMatches = () => api.get('/matches').then((r) => r.data)
export const updateMatchStatus = (id, status) => api.patch(`/matches/${id}/status`, { status }).then((r) => r.data)
export const createCapacityListing = (data) => api.post('/capacity-listings', data).then((r) => r.data)
export const getCapacityListings = () => api.get('/capacity-listings').then((r) => r.data)
export const getAnalytics = () => api.get('/analytics/summary').then((r) => r.data)
export const verifyVehicle = (id, payload) => api.patch(`/vehicles/${id}/verify`, payload).then((r) => r.data)
export const getUsers = () => api.get('/users').then((r) => r.data)
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role?role=${role}`).then((r) => r.data)
export const healthCheck = () => api.get('/health').then((r) => r.data)

export default api
