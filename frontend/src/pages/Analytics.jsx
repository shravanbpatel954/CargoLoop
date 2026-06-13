import { useEffect, useState } from 'react'
import { getAnalytics } from '../services/api'
import { BarChart3, IndianRupee, Route, Leaf, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getAnalytics().then(setData).catch(() => {})
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-medium animate-pulse">
        Fetching real-time impact metrics...
      </div>
    )
  }

  const cards = [
    {
      label: 'Revenue Generated',
      value: `₹${data.revenueGenerated.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      detail: 'From matched backhaul opportunities',
    },
    {
      label: 'Empty KM Saved',
      value: `${data.emptyKmSaved} km`,
      icon: Route,
      detail: 'Deadhead reduction via route overlap',
    },
    {
      label: 'CO₂ Saved',
      value: `${data.co2SavedKg} kg`,
      icon: Leaf,
      detail: 'Estimated emissions avoided',
    },
    {
      label: 'Vehicle Utilization',
      value: `${data.vehicleUtilization}%`,
      icon: Truck,
      detail: 'Fleet actively carrying cargo',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
               <BarChart3 size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Impact Data</h1>
          </div>
          <p className="text-slate-400">
            Real-world metrics measuring revenue velocity, fleet efficiency, and sustainability.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map(({ label, value, icon: Icon, detail }, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={label}
            className="glass-panel p-6 rounded-3xl group hover:border-slate-700 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-500/10 transition-colors" />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-2 text-4xl font-extrabold text-white heading-font tracking-tight">{value}</p>
                <p className="mt-3 text-sm font-medium text-brand-400 bg-brand-500/10 inline-block px-3 py-1 rounded-full border border-brand-500/20">{detail}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-brand-400 shadow-inner">
                <Icon size={28} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="glass-panel p-8 rounded-3xl"
      >
        <h2 className="text-xl font-bold text-white heading-font mb-6">Network Activity</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 text-center">
            <p className="text-3xl font-bold text-white heading-font">{data.totalLoads}</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-500">Loads</p>
          </div>
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 text-center">
            <p className="text-3xl font-bold text-white heading-font">{data.totalVehicles}</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-500">Vehicles</p>
          </div>
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 text-center">
            <p className="text-3xl font-bold text-brand-400 heading-font">{data.totalMatches}</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-brand-500">Matches Executed</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
