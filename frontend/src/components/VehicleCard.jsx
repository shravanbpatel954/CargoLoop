import { Truck, Snowflake, ArrowRight } from 'lucide-react'

export default function VehicleCard({ vehicle, highlighted }) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
        highlighted
          ? 'border-brand-500/40 bg-slate-900/80 shadow-[0_0_20px_rgba(14,165,233,0.1)] backdrop-blur-xl'
          : 'glass-panel hover:border-slate-700'
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`rounded-xl border p-3 ${highlighted ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <Truck size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white heading-font tracking-tight">{vehicle.vehicleNumber}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400 font-medium">
               <span className="bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800">{vehicle.currentLocation}</span>
               <ArrowRight size={14} className="text-slate-600" />
               <span className="bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800">{vehicle.destination}</span>
            </div>
          </div>
        </div>
        {highlighted && (
          <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold tracking-wide uppercase text-white shadow-[0_0_10px_rgba(14,165,233,0.4)]">
            Best Match
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 relative z-10">
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 px-4 py-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</p>
          <p className="mt-1 text-lg font-bold text-white">{vehicle.availableCapacity} <span className="text-sm font-medium text-slate-400">kg</span></p>
        </div>
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 px-4 py-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Reliability</p>
          <p className="mt-1 text-lg font-bold text-white">{vehicle.reliability}<span className="text-sm font-medium text-brand-400">%</span></p>
        </div>
      </div>

      {vehicle.coldStorage && (
        <div className="mt-4 relative z-10 flex items-center justify-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 py-2 text-sm font-semibold text-brand-400">
          <Snowflake size={16} />
          Cold Storage Certified
        </div>
      )}
    </article>
  )
}
