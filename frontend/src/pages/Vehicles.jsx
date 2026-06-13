import { useEffect, useState } from 'react'
import { createVehicle, getVehicles } from '../services/api'
import { Plus, Truck, ShieldCheck, ShieldAlert } from 'lucide-react'

const initialForm = {
  vehicleNumber: '',
  vehicleType: 'Truck',
  maxCapacityKg: 5000,
  coldStorage: false,
  verificationProof: '',
}

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-400"

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
      setForm(initialForm)
      await refresh()
    } catch {
      setError('Could not register vehicle. Is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
               <Truck size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Fleet Hub</h1>
          </div>
          <p className="text-slate-400">Register your vehicles here. Once verified, you can list their daily capacity and routes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr] gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-6 sm:p-8 rounded-3xl sticky top-24"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white heading-font">Register Vehicle</h2>
          </div>
          
          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Vehicle Number (e.g. MH12AB1234)</span>
              <input
                required
                className={inputClass}
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                placeholder="MH12AB1234"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className={labelClass}>Vehicle Type</span>
                <select
                  required
                  className={inputClass}
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                >
                  <option value="Truck">Truck</option>
                  <option value="Trailer">Trailer</option>
                  <option value="LCV">LCV</option>
                  <option value="Reefer">Reefer</option>
                </select>
              </label>

              <label className="block">
                <span className={labelClass}>Max Capacity (kg)</span>
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  value={form.maxCapacityKg}
                  onChange={(e) => setForm({ ...form, maxCapacityKg: Number(e.target.value) })}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Verification Proof (RC/Insurance Link)</span>
              <input
                required
                type="url"
                className={inputClass}
                value={form.verificationProof}
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
            <h2 className="text-lg font-bold text-white heading-font">Registered Fleet</h2>
            <span className="text-sm font-medium text-slate-500">{vehicles.length} total</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-slate-800 hover:border-brand-500/30 transition-all">
                 <div className="absolute top-0 right-0 p-4">
                    {vehicle.status === 'verified' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                        <ShieldCheck size={14} /> Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                        <ShieldAlert size={14} /> Pending
                      </div>
                    )}
                 </div>
                 
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-400 border border-brand-500/20">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide">{vehicle.vehicleNumber}</h3>
                      <p className="text-sm text-slate-400 font-medium">{vehicle.vehicleType}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Max Capacity</p>
                      <p className="text-base text-white font-bold">{vehicle.maxCapacityKg} <span className="text-xs text-slate-500 font-normal">kg</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Cold Chain</p>
                      <p className={`text-sm font-bold ${vehicle.coldStorage ? 'text-brand-400' : 'text-slate-400'}`}>
                        {vehicle.coldStorage ? 'Yes' : 'No'}
                      </p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
