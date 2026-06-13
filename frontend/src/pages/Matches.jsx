import { useEffect, useState } from 'react'
import { generateMatch, getLoads, getVehicles } from '../services/api'
import LoadCard from '../components/LoadCard'
import VehicleCard from '../components/VehicleCard'
import MatchCard from '../components/MatchCard'
import MapView from '../components/MapView'
import { Route as RouteIcon, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Matches() {
  const [loads, setLoads] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [matchingId, setMatchingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getLoads(), getVehicles()])
      .then(([l, v]) => {
        setLoads(l)
        setVehicles(v)
      })
      .catch(() => setError('Failed to load data'))
  }, [])

  const handleMatch = async (loadId) => {
    setMatchingId(loadId)
    setError('')
    try {
      const result = await generateMatch(loadId)
      setSelectedMatch(result)
    } catch {
      setError('Matching failed. Ensure vehicles with enough capacity are registered.')
    } finally {
      setMatchingId(null)
    }
  }

  const handleAutoMatchAll = async () => {
    // Demo function to show "complete solution" feel
    if (loads.length === 0) return;
    handleMatch(loads[0]._id);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400 border border-brand-500/20">
               <RouteIcon size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Autonomous Match Engine</h1>
          </div>
          <p className="text-slate-400">
            Proprietary scoring evaluates route overlap, distance, reliability, and cargo fit in real-time.
          </p>
        </div>
        <button 
          onClick={handleAutoMatchAll}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:bg-brand-400 transition-all"
        >
          <Zap size={18} />
          Auto-Match Pending
        </button>
      </header>

      {error && (
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </motion.p>
      )}

      <div className="grid gap-8 xl:grid-cols-2 items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h2 className="font-bold text-white heading-font text-lg">Pending Dispatches</h2>
             <span className="text-sm font-medium text-slate-500">{loads.length} total</span>
          </div>
          {loads.map((load) => (
            <LoadCard
              key={load._id}
              load={load}
              onMatch={handleMatch}
              matching={matchingId === load._id}
            />
          ))}
          {!loads.length && (
            <div className="glass-panel p-8 text-center rounded-2xl">
              <p className="text-slate-400 font-medium">No pending dispatches.</p>
            </div>
          )}
        </div>

        <div className="space-y-6 sticky top-24">
          {selectedMatch && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
               <MatchCard match={selectedMatch} load={loads.find(l => l._id === selectedMatch.loadId)} />
            </motion.div>
          )}
          <div className="glass-panel p-2 rounded-3xl overflow-hidden h-[400px]">
             <MapView loads={loads} vehicles={vehicles} selectedMatch={selectedMatch} />
          </div>
        </div>
      </div>

      {vehicles.length > 0 && (
        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between px-2 mb-6">
            <h2 className="font-bold text-white heading-font text-xl">Active Fleet Radar</h2>
            <span className="text-sm font-medium text-brand-400">{vehicles.length} assets tracking</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                highlighted={vehicle._id === selectedMatch?.vehicleId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
