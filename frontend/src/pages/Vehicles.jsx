import { useEffect, useState } from 'react'
import { createVehicle, getVehicles } from '../services/api'
import VehicleCard from '../components/VehicleCard'
import MapPickerModal from '../components/MapPickerModal'
import { Plus, Truck, MapPin } from 'lucide-react'

const initialForm = {
  vehicleNumber: 'MH12AB1234',
  currentLocation: '',
  currentLat: null,
  currentLng: null,
  destination: '',
  destLat: null,
  destLng: null,
  availableCapacity: 500,
  coldStorage: true,
  reliability: 96,
}

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-400"

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [mapTarget, setMapTarget] = useState(null) // 'current' or 'dest'

  const refresh = () => getVehicles().then(setVehicles).catch(() => setError('Failed to load vehicles'))

  useEffect(() => {
    refresh()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createVehicle(form)
      setForm({ ...initialForm, vehicleNumber: '' })
      await refresh()
    } catch {
      setError('Could not register vehicle. Is the backend running?')
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
            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
               <Truck size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Fleet Hub</h1>
          </div>
          <p className="text-slate-400">Register available fleet capacity to immediately start receiving autonomous matches.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr] gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-6 sm:p-8 rounded-3xl sticky top-24"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white heading-font">Register Capacity</h2>
          </div>
          
          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Vehicle Identifier</span>
              <input
                required
                className={inputClass}
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                placeholder="e.g. MH12AB1234"
              />
            </label>

            <div className="space-y-4">
              <label className="block relative">
                <span className={labelClass}>Pick-up Location</span>
                <div className="flex gap-2 items-center mt-1.5">
                  <input
                    required
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                    value={form.currentLocation}
                    onChange={(e) => setForm({ ...form, currentLocation: e.target.value })}
                    placeholder="Enter starting location"
                  />
                  <button type="button" onClick={() => setMapTarget('current')} className="p-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl border border-brand-500/30 transition-colors">
                    <MapPin size={20} />
                  </button>
                </div>
              </label>

              <label className="block relative">
                <span className={labelClass}>Drop-off Location</span>
                <div className="flex gap-2 items-center mt-1.5">
                  <input
                    required
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="Enter intended destination"
                  />
                  <button type="button" onClick={() => setMapTarget('dest')} className="p-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl border border-brand-500/30 transition-colors">
                    <MapPin size={20} />
                  </button>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>Capacity (kg)</span>
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  value={form.availableCapacity}
                  onChange={(e) => setForm({ ...form, availableCapacity: Number(e.target.value) })}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Reliability %</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  className={inputClass}
                  value={form.reliability}
                  onChange={(e) => setForm({ ...form, reliability: Number(e.target.value) })}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Verification Proof (RC/Doc Link)</span>
              <input
                required
                type="url"
                className={inputClass}
                value={form.verificationProof || ''}
                onChange={(e) => setForm({ ...form, verificationProof: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
              />
            </label>

            <label className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-colors mt-2">
              <input
                type="checkbox"
                checked={form.coldStorage}
                onChange={(e) => setForm({ ...form, coldStorage: e.target.checked })}
                className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm font-semibold text-white">Cold storage enabled</span>
            </label>

            {error && <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white transition hover:bg-brand-400 disabled:opacity-60 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            >
              <Plus size={18} />
              {saving ? 'Registering…' : 'Register Vehicle'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white heading-font">Active Fleet Capacity</h2>
            <span className="text-sm font-medium text-slate-500">{vehicles.length} total</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
