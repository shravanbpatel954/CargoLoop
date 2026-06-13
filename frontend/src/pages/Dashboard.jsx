import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, Package, Route, Leaf, IndianRupee, ShieldAlert, CloudLightning, AlertTriangle } from 'lucide-react'
import { getAnalytics, getLoads, getVehicles } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MapView from '../components/MapView'
import AgenticDispatcher from '../components/AgenticDispatcher'
import AgentFeed from '../components/AgentFeed'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const statIcons = {
  activeCapacityListings: Route,
  verifiedVehicles: Truck,
  verifiedCarriers: ShieldAlert,
  emptyKmSaved: Route,
  revenueGenerated: IndianRupee,
  vehicleUtilization: Truck,
}

const statLabels = {
  activeCapacityListings: 'Active Capacity Listings',
  verifiedVehicles: 'Verified Vehicles',
  verifiedCarriers: 'Verified Carriers',
  emptyKmSaved: 'Total Empty KM Saved',
  revenueGenerated: 'Revenue Generated',
  vehicleUtilization: 'Vehicle Utilization %',
}

// Dummy data for the carbon graph over time
const carbonData = [
  { name: 'Mon', co2: 120 },
  { name: 'Tue', co2: 210 },
  { name: 'Wed', co2: 180 },
  { name: 'Thu', co2: 305 },
  { name: 'Fri', co2: 420 },
  { name: 'Sat', co2: 500 },
  { name: 'Sun', co2: 650 },
]

function PredictiveRiskPanel() {
  const [riskItems, setRiskItems] = useState([
    { type: 'weather', title: 'Heavy Monsoon Rain', location: 'Mumbai-Pune Exp', impact: 'Moderate', icon: CloudLightning, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { type: 'traffic', title: 'Border Congestion', location: 'Nashik Toll', impact: 'High', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ])

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col h-[250px] overflow-hidden relative">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-transparent opacity-50" />
       <h2 className="font-bold heading-font text-white flex items-center gap-2 mb-4">
         <ShieldAlert size={18} className="text-yellow-500" />
         Predictive Risk AI
       </h2>
       <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
         {riskItems.map((item, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.2 }}
             className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800"
           >
             <div className={`p-2 rounded-lg ${item.bg} ${item.color} shrink-0`}>
               <item.icon size={16} />
             </div>
             <div>
               <p className="text-sm font-bold text-slate-200">{item.title}</p>
               <p className="text-xs text-slate-500">{item.location} • {item.impact} Impact</p>
               <p className="text-[10px] text-brand-400 mt-1 uppercase font-semibold tracking-wider">AI Rerouting Active</p>
             </div>
           </motion.div>
         ))}
       </div>
    </div>
  )
}

export default function Dashboard() {
  const { role, user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loads, setLoads] = useState([])
  const [vehicles, setVehicles] = useState([])

  const fetchData = () => {
    Promise.all([getAnalytics(), getLoads(), getVehicles()])
      .then(([a, l, v]) => {
        setAnalytics(a)
        setLoads(l)
        setVehicles(v)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold heading-font text-white">CargoLoop Command Center</h1>
          <p className="mt-2 text-sm text-slate-400">
            {role === 'shipper' && 'Intelligent load dispatch and backhaul routing.'}
            {role === 'carrier' && 'AI-driven fleet utilization and risk management.'}
            {role === 'admin' && 'Global platform oversight: Routes, Risk, and Carbon impact.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-brand-500/10 text-brand-400 px-4 py-2 rounded-full border border-brand-500/30">
          <ShieldAlert size={16} />
          <span className="text-sm font-medium">Predictive Routing Active</span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {analytics &&
          ['activeCapacityListings', 'verifiedVehicles', 'verifiedCarriers', 'emptyKmSaved', 'revenueGenerated', 'vehicleUtilization'].map((key, i) => {
            const Icon = statIcons[key]
            const suffix = key === 'vehicleUtilization' ? '%' : key === 'revenueGenerated' ? '' : ''
            const value =
              key === 'revenueGenerated'
                ? `₹${analytics[key]?.toLocaleString('en-IN') || 0}`
                : `${analytics[key] || 0}${suffix}`

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={key}
                className="glass-panel p-5 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 bg-brand-500/20 text-brand-400`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">{statLabels[key]}</p>
                    <p className="text-2xl font-bold heading-font text-white">{value}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
      </div>

      {/* Main Map & Dispatcher Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {role === 'shipper' && (
          <div className="lg:col-span-1 h-[600px]">
            <AgenticDispatcher onCreated={fetchData} />
          </div>
        )}
        <div className={`lg:col-span-${role === 'shipper' ? '2' : '3'} h-[600px] glass-panel rounded-2xl overflow-hidden relative shadow-2xl border-brand-500/20`}>
           <MapView loads={loads} vehicles={vehicles} />
           <div className="absolute top-4 left-4 z-[1000] bg-slate-900/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-200 shadow-xl flex items-center gap-2">
             <Route size={16} className="text-brand-400" />
             Live Global Radar
           </div>
        </div>
      </div>

      {/* Bottom Panels Row */}
      <div className={`grid gap-6 ${role === 'shipper' || role === 'admin' ? 'lg:grid-cols-[1fr_400px]' : 'lg:grid-cols-2'}`}>
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PredictiveRiskPanel />

            <div className="glass-panel p-5 rounded-2xl h-[250px] flex flex-col">
              <h2 className="font-bold heading-font text-white flex items-center gap-2 mb-4">
                <Leaf size={18} className="text-accent" />
                Carbon Tokenization
              </h2>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={carbonData}>
                    <defs>
                      <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="co2" stroke="#10b981" fillOpacity={1} fill="url(#colorCo2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {role === 'shipper' && (
            <div className="glass-panel p-5 rounded-2xl flex flex-col h-[250px] overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-transparent opacity-50" />
               <h2 className="font-bold heading-font text-white flex items-center gap-2 mb-4">
                 <Truck size={18} className="text-brand-400" />
                 Active Fleet Radar
               </h2>
               <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                 {vehicles.filter(v => v.status === 'verified').length === 0 ? (
                   <p className="text-sm text-slate-500 text-center mt-4">No verified vehicles nearby.</p>
                 ) : (
                   vehicles.filter(v => v.status === 'verified').map((v, i) => (
                     <motion.div 
                       key={v._id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800"
                     >
                       <div>
                         <p className="text-sm font-bold text-slate-200">{v.vehicleNumber}</p>
                         <p className="text-xs text-slate-500">{v.availableCapacity} kg • {v.coldStorage ? 'Cold' : 'Standard'}</p>
                       </div>
                       <div className="text-right">
                         <div className="flex items-center gap-1 justify-end">
                           <ShieldAlert size={12} className="text-purple-400" />
                           <span className="text-xs font-bold text-purple-400">{v.trustScore}%</span>
                         </div>
                         <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Trust Score</p>
                       </div>
                     </motion.div>
                   ))
                 )}
               </div>
            </div>
          )}
        </div>

        {/* Live Agent Feed Column */}
        {(role === 'shipper' || role === 'admin') && (
          <div className="h-[524px] lg:h-auto">
             <AgentFeed />
          </div>
        )}
      </div>
    </motion.div>
  )
}
