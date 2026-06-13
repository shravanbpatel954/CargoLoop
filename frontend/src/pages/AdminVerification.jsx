import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ShieldAlert, AlertTriangle, Truck, FileCheck } from 'lucide-react'
import { getVehicles, verifyVehicle } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AdminVerification() {
  const { role } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles()
      setVehicles(data.filter(v => v.status === 'pending'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleVerify = async (id, status) => {
    try {
      await verifyVehicle(id, { 
        status, 
        trust_score: status === 'verified' ? Math.floor(Math.random() * 20) + 80 : 0 
      })
      setVehicles(vehicles.filter(v => v._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md">
          <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You do not have administrative privileges to view this area.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
               <ShieldAlert size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">Admin Verification</h1>
          </div>
          <p className="text-slate-400">Review pending fleet registrations and assign AI Trust Scores.</p>
        </div>
      </header>

      {loading ? (
        <p className="text-slate-500">Loading pending vehicles...</p>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
          <Truck className="mx-auto text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-white">No pending registrations</h3>
          <p className="text-slate-500 mt-1">All vehicles have been verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, i) => (
            <motion.div 
              key={vehicle._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/80 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/50" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{vehicle.vehicleNumber}</h3>
                  <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-1">
                    <AlertTriangle size={12} /> Pending Review
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{vehicle.availableCapacity} <span className="text-sm font-normal text-slate-500">kg</span></p>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">Pick-up Location</p>
                  <p className="text-sm text-slate-200 font-medium truncate">{vehicle.currentLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Drop-off Location</p>
                  <p className="text-sm text-slate-200 font-medium truncate">{vehicle.destination}</p>
                </div>
                
                {vehicle.verificationProof && (
                  <div className="pt-2 border-t border-slate-800 mt-2">
                    <p className="text-xs text-slate-500 mb-1">Attached Verification Document</p>
                    <a 
                      href={vehicle.verificationProof} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-medium bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20 transition-colors"
                    >
                      <FileCheck size={16} />
                      View Document
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleVerify(vehicle._id, 'verified')}
                  className="flex-1 bg-brand-500 hover:bg-brand-400 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Check size={18} /> Verify
                </button>
                <button 
                  onClick={() => handleVerify(vehicle._id, 'rejected')}
                  className="px-4 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-bold py-2.5 rounded-xl border border-slate-700 hover:border-red-500/50 flex items-center justify-center transition-all"
                >
                  <X size={18} /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
