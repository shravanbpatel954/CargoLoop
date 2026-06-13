import { useState, useEffect } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { ArrowLeft, Navigation, Activity, Clock, ShieldCheck, ThermometerSnowflake } from 'lucide-react'
import { motion } from 'framer-motion'

// Icons
const truckIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#0ea5e9;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 20px #0ea5e9"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const dotIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#10b981;width:12px;height:12px;border-radius:50%;border:2px solid #fff"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

// Helper to interpolate between two points
function interpolatePoint(p1, p2, fraction) {
  return [
    p1[0] + (p2[0] - p1[0]) * fraction,
    p1[1] + (p2[1] - p1[1]) * fraction
  ]
}

export default function LiveTracking() {
  const location = useLocation()
  const match = location.state?.match
  const load = location.state?.load
  
  if (!match || !load) {
    return <Navigate to="/app/matches" replace />
  }

  // Use exact coordinates if available, fallback to dummy defaults
  const startCoords = [
    load.pickupLat || 19.9975,
    load.pickupLng || 73.7898
  ]
  const endCoords = [
    load.dropLat || 19.0760,
    load.dropLng || 72.8777
  ]

  const routePath = [startCoords, endCoords]
  
  const [progress, setProgress] = useState(0) // 0 to 1
  const [currentCoords, setCurrentCoords] = useState(startCoords)

  // Simulate movement
  useEffect(() => {
    let animationFrame
    const duration = 20000 // 20 seconds for demo
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const fraction = Math.min(elapsed / duration, 1)
      setProgress(fraction)
      setCurrentCoords(interpolatePoint(startCoords, endCoords, fraction))

      if (fraction < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/app/matches" className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Activity className="text-brand-400" size={20} />
              <h1 className="text-2xl font-bold heading-font text-white">Live Tracking Hub</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">Autonomous Shipment Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm font-bold tracking-wide uppercase">On Route</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Map Area */}
        <div className="glass-panel rounded-3xl overflow-hidden relative border border-slate-800">
          <MapContainer center={startCoords} zoom={8} className="w-full h-full">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={startCoords} icon={dotIcon}>
              <Popup>Origin: {load.pickup}</Popup>
            </Marker>
            <Marker position={endCoords} icon={dotIcon}>
              <Popup>Destination: {load.drop}</Popup>
            </Marker>
            <Polyline positions={routePath} pathOptions={{ color: '#334155', weight: 4, opacity: 0.8 }} />
            <Polyline positions={[startCoords, currentCoords]} pathOptions={{ color: '#0ea5e9', weight: 4 }} />
            <Marker position={currentCoords} icon={truckIcon}>
              <Popup>Live Position: {match.vehicleNumber}</Popup>
            </Marker>
          </MapContainer>
          
          <div className="absolute top-4 right-4 z-[1000] glass-panel bg-slate-950/80 px-4 py-3 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Speed</span>
              <span className="text-lg font-bold text-white">{(65 + Math.random() * 5).toFixed(0)} <span className="text-sm text-slate-500">km/h</span></span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Progress</span>
              <span className="text-lg font-bold text-brand-400">{(progress * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Telemetry Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
             <h3 className="text-lg font-bold text-white mb-4">Shipment Details</h3>
             <div className="space-y-4">
               <div>
                 <p className="text-xs text-slate-500 mb-1">Vehicle Match</p>
                 <p className="text-brand-400 font-bold">{match.vehicleNumber}</p>
               </div>
               <div className="pt-3 border-t border-slate-800">
                 <p className="text-xs text-slate-500 mb-1">Origin</p>
                 <p className="text-white text-sm line-clamp-2">{load.pickup}</p>
               </div>
               <div className="pt-3 border-t border-slate-800">
                 <p className="text-xs text-slate-500 mb-1">Destination</p>
                 <p className="text-white text-sm line-clamp-2">{load.drop}</p>
               </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex-1">
            <h3 className="text-lg font-bold text-white mb-4">Live Telemetry</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-brand-400" />
                  <span className="text-sm text-slate-300">Est. Time Remaining</span>
                </div>
                <span className="font-bold text-white">2h 14m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <ThermometerSnowflake size={18} className="text-brand-400" />
                  <span className="text-sm text-slate-300">Cargo Temp</span>
                </div>
                <span className="font-bold text-white">-4.2°C</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-sm text-slate-300">Route Safety</span>
                </div>
                <span className="font-bold text-emerald-400">Optimal</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Dispatched</span>
                <span>Arriving</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-300" 
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
