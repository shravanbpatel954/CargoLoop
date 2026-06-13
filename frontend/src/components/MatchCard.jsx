import { Sparkles, Gauge, AlertTriangle, IndianRupee, Leaf, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function MatchCard({ match, load }) {
  const navigate = useNavigate()
  
  if (!match) return null

  // Simulate carbon saved based on score if not provided by backend
  const simulatedCarbonSaved = match.score ? Math.floor(match.score * 1.5) : 120

  const handleTrack = () => {
    navigate(`/app/tracking`, { state: { match, load } })
  }

  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 rounded-2xl border border-brand-500/40 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-sm text-brand-300 font-medium">Optimal AI Match</p>
          <h3 className="mt-1 text-3xl font-bold heading-font text-white">{match.vehicleNumber}</h3>
        </div>
        <div className="flex gap-2">
          {match.breakdown?.dynamicPrice && (
             <div className="flex flex-col items-end justify-center px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-700">
               <span className="text-xs text-slate-400">Dynamic Price</span>
               <div className="flex items-center text-white font-bold text-lg">
                 <IndianRupee size={16} />
                 {match.breakdown.dynamicPrice.toLocaleString('en-IN')}
               </div>
             </div>
          )}
          <div className="flex flex-col items-end justify-center px-4 py-2 bg-brand-500/20 rounded-xl border border-brand-500/30">
            <span className="text-xs text-brand-300">Score</span>
            <div className="flex items-center gap-1 text-brand-400 font-bold text-xl">
              <Gauge size={18} />
              {match.score}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 relative z-10">
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-3 flex gap-3 items-center">
          <Leaf className="text-accent shrink-0" size={20} />
          <div className="flex-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-accent">Environmental Impact</p>
            <p className="text-sm font-bold text-white">~{simulatedCarbonSaved} kg CO₂ Saved</p>
          </div>
        </div>
      </div>

      {match.breakdown && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 relative z-10">
          {Object.entries(match.breakdown).filter(([k]) => k !== 'dynamicPrice').map(([key, value]) => {
            const isRisk = key.toLowerCase().includes('risk');
            return (
              <div key={key} className={`rounded-xl px-3 py-2 text-center border ${isRisk ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                <p className={`text-xs capitalize ${isRisk ? 'text-red-300' : 'text-slate-400'}`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className={`font-semibold ${isRisk ? 'text-red-400' : 'text-white'}`}>{value}</p>
              </div>
            )
          })}
        </div>
      )}

      {match.breakdown?.riskScore > 20 && (
        <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 flex gap-3 items-start">
          <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-orange-300">High Route Risk Detected</p>
            <p className="text-xs text-orange-200/70 mt-1">Due to simulated weather or hazard conditions, this route has an elevated risk score. Price has been dynamically adjusted.</p>
          </div>
        </div>
      )}

      {match.explanation && (
        <div className="mt-5 rounded-xl border border-brand-500/20 bg-slate-900/40 p-4 relative z-10">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-300">
            <Sparkles size={16} />
            AI Reasoning
          </p>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
            {match.explanation}
          </pre>
        </div>
      )}
      
      {load && (
        <div className="mt-5 relative z-10">
          <button 
            onClick={handleTrack}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
          >
            <Navigation size={18} />
            Track Live Shipment
          </button>
        </div>
      )}
    </motion.article>
  )
}
