import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getAnalytics } from '../services/api'

export default function TrustGraph() {
  const { role } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getAnalytics()
        setData(stats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20">
          <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        </div>
      </div>
    )
  }

  const dist = data?.trustDistribution || { platinum: 0, gold: 0, silver: 0, new: 0 }
  
  const chartData = [
    { name: 'Platinum (90-100)', count: dist.platinum, color: '#22d3ee' }, // cyan
    { name: 'Gold (80-89)', count: dist.gold, color: '#facc15' }, // yellow
    { name: 'Silver (65-79)', count: dist.silver, color: '#e2e8f0' }, // slate
    { name: 'New (0-64)', count: dist.new, color: '#94a3b8' }, // slate-400
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
            <Users size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white heading-font">Behavioral Trust Graph</h1>
        </div>
        <p className="text-slate-400">Not stars. Not reviews. Pure behavioral signals calculated from transaction data.</p>
      </header>

      {loading ? (
        <p className="text-slate-500">Loading trust distribution...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border border-brand-500/20">
            <h2 className="text-xl font-bold text-white mb-6">Fleet Trust Distribution</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border border-brand-500/20">
            <h2 className="text-xl font-bold text-white mb-6">Algorithm Weighting</h2>
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-200">On-Time Delivery Rate</span>
                  <span className="text-xs font-bold text-brand-400">30%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '30%' }}></div></div>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-200">Load Accuracy Rate (Declared vs Actual Kg)</span>
                  <span className="text-xs font-bold text-brand-400">25%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '25%' }}></div></div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-200">Response Time (Acceptance speed)</span>
                  <span className="text-xs font-bold text-brand-400">20%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '20%' }}></div></div>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-200">Completion Rate</span>
                  <span className="text-xs font-bold text-brand-400">15%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '15%' }}></div></div>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-200">Dispute-Free Deliveries</span>
                  <span className="text-xs font-bold text-brand-400">10%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '10%' }}></div></div>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  )
}
