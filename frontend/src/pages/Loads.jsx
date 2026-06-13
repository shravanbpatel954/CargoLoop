import { useEffect, useState } from 'react'
import { createLoad, getLoads } from '../services/api'
import LoadCard from '../components/LoadCard'
import MapPickerModal from '../components/MapPickerModal'
import { Plus, Package, MapPin } from 'lucide-react'

const initialForm = {
  pickup: '',
  pickupLat: null,
  pickupLng: null,
  drop: '',
  dropLat: null,
  dropLng: null,
  weight: 200,
  cargoType: 'Perishable',
  urgency: 'High',
}

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-400"

export default function Loads() {
  const [loads, setLoads] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [mapTarget, setMapTarget] = useState(null) // 'pickup' or 'drop'

  const refresh = () => getLoads().then(setLoads).catch(() => setError('Failed to load shipments'))

  useEffect(() => {
    refresh()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createLoad(form)
      setForm(initialForm)
      await refresh()
    } catch {
      setError('Could not create shipment. Is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  const handleMapSelect = (data) => {
    if (mapTarget === 'pickup') {
      setForm({ ...form, pickup: data.address, pickupLat: data.lat, pickupLng: data.lng })
    } else if (mapTarget === 'drop') {
      setForm({ ...form, drop: data.address, dropLat: data.lat, dropLng: data.lng })
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
          mapTarget === 'pickup' && form.pickupLat
            ? { lat: form.pickupLat, lng: form.pickupLng }
            : mapTarget === 'drop' && form.dropLat
            ? { lat: form.dropLat, lng: form.dropLng }
            : null
        }
      />

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
               <Package size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Dispatch Hub</h1>
          </div>
          <p className="text-slate-400">Configure and deploy new cargo requests into the autonomous network.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr] gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-6 sm:p-8 rounded-3xl sticky top-24"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white heading-font">New Dispatch</h2>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-4">
              <label className="block relative">
                <span className={labelClass}>Pick-up Location</span>
                <div className="flex gap-2 items-center mt-1.5">
                  <input
                    required
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                    value={form.pickup}
                    onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                    placeholder="Enter pickup location"
                  />
                  <button type="button" onClick={() => setMapTarget('pickup')} className="p-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl border border-brand-500/30 transition-colors">
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
                    value={form.drop}
                    onChange={(e) => setForm({ ...form, drop: e.target.value })}
                    placeholder="Enter delivery location"
                  />
                  <button type="button" onClick={() => setMapTarget('drop')} className="p-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl border border-brand-500/30 transition-colors">
                    <MapPin size={20} />
                  </button>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>Weight (kg)</span>
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Urgency</span>
                <select
                  className={inputClass}
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Cargo Type</span>
              <input
                required
                className={inputClass}
                value={form.cargoType}
                onChange={(e) => setForm({ ...form, cargoType: e.target.value })}
                placeholder="e.g., Perishable, Electronics"
              />
            </label>

            {error && <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white transition hover:bg-brand-400 disabled:opacity-60 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            >
              <Plus size={18} />
              {saving ? 'Deploying…' : 'Deploy Cargo'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white heading-font">Active Deployments</h2>
            <span className="text-sm font-medium text-slate-500">{loads.length} total</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loads.map((load) => (
              <LoadCard key={load._id} load={load} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
