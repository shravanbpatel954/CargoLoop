import { Package, ArrowRight, Loader2 } from 'lucide-react'

const urgencyColor = {
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
}

export default function LoadCard({ load, onMatch, matching }) {
  return (
    <article className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-500/10 transition-colors" />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-brand-400 shadow-inner">
            <Package size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white heading-font tracking-tight">
              {load.weight}kg {load.cargoType}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400 font-medium">
              <span className="bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800">{load.pickup}</span>
              <ArrowRight size={14} className="text-slate-600" />
              <span className="bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800">{load.drop}</span>
            </div>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase ${urgencyColor[load.urgency] || urgencyColor.Medium}`}
        >
          {load.urgency}
        </span>
      </div>

      {onMatch && (
        <button
          type="button"
          onClick={() => onMatch(load._id)}
          disabled={matching}
          className="relative z-10 mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
        >
          {matching ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Running Engine...
            </>
          ) : 'Auto-Match Capacity'}
        </button>
      )}
    </article>
  )
}
