import { useEffect, useState } from 'react'
import { createCapacityListing, getCapacityListings, getVehicles } from '../services/api'
import MapPickerModal from '../components/MapPickerModal'
import { Plus, Route, MapPin, Calendar, Clock, Truck } from 'lucide-react'

const initialForm = {
  vehicleId: '',
  currentLocation: '',
  currentLat: null,
  currentLng: null,
  destination: '',
  destLat: null,
  destLng: null,
  availableCapacityKg: 1000,
  departureTime: new Date().toISOString().slice(0, 16),
}

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-400"

export default function CapacityListings() {
  const [listings, setListings] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [mapTarget, setMapTarget] = useState(null)

  const refresh = () => {
    getCapacityListings().then(setListings).catch(() => setError('Failed to load listings'))
    getVehicles().then(v => setVehicles(v.filter(x => x.status === 'verified'))).catch(console.error)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.vehicleId) {
      setError("Please select a verified vehicle.")
      return
    }
    setSaving(true)
    setError('')
    try {
      await createCapacityListing(form)
      setForm(initialForm)
      await refresh()
    } catch {
      setError('Could not create listing. Ensure vehicle is verified.')
    } finally {
      setSaving(false)
    }
  }

  const handleMapSelect = (data) => {
    if (mapTarget === 'current') {
      setForm({ ...form, currentLocation: data.address, currentLat: data.lat, currentLng: data.lng })
    } else if (mapTarget === 'dest') {
      setForm({ ...form, destination: data.address, destLat: data.lat, destLng: data.lng })
    }
    setMapTarget(null)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <MapPickerModal
        isOpen={!!mapTarget}
        onClose={() => setMapTarget(null)}
        onSelect={handleMapSelect}
        initialPos={
          mapTarget === 'current' && form.currentLat
            ? { lat: form.currentLat, lng: form.currentLng }
            : mapTarget === 'dest' && form.destLat
            ? { lat: form.destLat, lng: form.destLng }
            : null
        }
      />

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
               <Route size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Capacity Listings</h1>
          </div>
          <p className="text-slate-400">List the daily routes of your verified fleet to monetize empty return trips.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr] gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-6 sm:p-8 rounded-3xl sticky top-24"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white heading-font">Create Listing</h2>
          </div>
          
          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Select Vehicle</span>
              <select
                required
                className={inputClass}
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="">-- Choose Verified Vehicle --</option>
                {vehicles.map(v => (
                  <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.maxCapacityKg}kg)</option>
                ))}
              </select>
            </label>

            <div className="space-y-4">
              <label className="block relative">
                <span className={labelClass}>Current Location (Pick-up)</span>
                <div className="flex gap-2 items-center mt-1.5">
                  <input
                    required
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                    value={form.currentLocation}
                    onChange={(e) => setForm({ ...form, currentLocation: e.target.value })}
                    placeholder="Starting city"
                  />
                  <button type="button" onClick={() => setMapTarget('current')} className="p-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl border border-brand-500/30 transition-colors">
                    <MapPin size={20} />
                  </button>
                </div>
              </label>

              <label className="block relative">
                <span className={labelClass}>Destination (Drop-off)</span>
                <div className="flex gap-2 items-center mt-1.5">
                  <input
                    required
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="Destination city"
                  />
                  <button type="button" onClick={() => setMapTarget('dest')} className="p-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl border border-brand-500/30 transition-colors">
                    <MapPin size={20} />
                  </button>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>Available (kg)</span>
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  value={form.availableCapacityKg}
                  onChange={(e) => setForm({ ...form, availableCapacityKg: Number(e.target.value) })}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Departure Time</span>
                <input
                  type="datetime-local"
                  required
                  className={inputClass}
                  value={form.departureTime}
                  onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                />
              </label>
            </div>

            {error && <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}

            <button
              type="submit"
              disabled={saving || vehicles.length === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-60 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Plus size={18} />
              {saving ? 'Creating…' : 'Create Listing'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white heading-font">Active Listings</h2>
            <span className="text-sm font-medium text-slate-500">{listings.length} total</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => {
              const vehicle = vehicles.find(v => v._id === listing.vehicleId)
              return (
                <div key={listing._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-slate-800 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                        <Truck size={16} />
                      </div>
                      <span className="font-bold text-slate-200">{vehicle?.vehicleNumber || 'Unknown'}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md uppercase tracking-wider">
                      {listing.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 relative pl-4 mb-4">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-slate-700"></div>
                    <div className="relative">
                      <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-brand-500 ring-4 ring-slate-900"></div>
                      <p className="text-sm text-slate-400">From</p>
                      <p className="font-bold text-white truncate">{listing.currentLocation}</p>
                    </div>
                    <div className="relative mt-2">
                      <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-slate-900"></div>
                      <p className="text-sm text-slate-400">To</p>
                      <p className="font-bold text-white truncate">{listing.destination}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-500" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Departure</p>
                        <p className="text-xs text-white font-medium">{new Date(listing.departureTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Available Space</p>
                      <p className="text-sm text-emerald-400 font-bold">{listing.availableCapacityKg} <span className="text-xs font-normal">kg</span></p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
