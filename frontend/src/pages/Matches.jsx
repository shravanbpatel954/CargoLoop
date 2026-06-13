import { useEffect, useState } from 'react'
import { generateMatch, getLoads, getCapacityListings, getVehicles } from '../services/api'
import LoadCard from '../components/LoadCard'
import MatchCard from '../components/MatchCard'
import MapView from '../components/MapView'
import { Route as RouteIcon, Zap, Route } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Matches() {
  const [loads, setLoads] = useState([])
  const [listings, setListings] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [matchingId, setMatchingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getLoads(), getCapacityListings(), getVehicles()])
      .then(([l, list, v]) => {
        setLoads(l)
        setListings(list.filter(x => x.status === 'active'))
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
      setError('Matching failed. Ensure there are active capacity listings available.')
    } finally {
      setMatchingId(null)
    }
  }

  const handleAutoMatchAll = async () => {
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
            Proprietary scoring evaluates active capacity listings against load requirements using AI.
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
             {/* MapView might still expect vehicles array format for markers, passing listings as vehicles for now */}
             <MapView loads={loads} vehicles={listings} selectedMatch={selectedMatch} />
          </div>
        </div>
      </div>

      {listings.length > 0 && (
        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between px-2 mb-6">
            <h2 className="font-bold text-white heading-font text-xl">Active Capacity Radar</h2>
            <span className="text-sm font-medium text-brand-400">{listings.length} routes active</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => {
              const vehicle = vehicles.find(v => v._id === listing.vehicleId);
              return (
                <div key={listing._id} className={`glass-panel p-5 rounded-2xl border ${listing._id === selectedMatch?.listingId ? 'border-brand-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'border-slate-800'}`}>
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="font-bold text-white">{vehicle?.vehicleNumber || 'Unknown'}</h3>
                       <p className="text-xs text-brand-400">{listing.availableCapacityKg}kg available</p>
                     </div>
                     <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">Active</span>
                   </div>
                   <div className="space-y-2 mt-4">
                     <div className="flex items-center gap-2 text-sm">
                       <Route size={14} className="text-slate-500"/>
                       <span className="text-slate-300">{listing.currentLocation} <span className="text-slate-600">→</span> {listing.destination}</span>
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
