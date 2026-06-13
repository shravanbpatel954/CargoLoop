import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { X, MapPin } from 'lucide-react'

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  return position === null ? null : <Marker position={position}></Marker>
}

export default function MapPickerModal({ isOpen, onClose, onSelect, initialPos }) {
  const [position, setPosition] = useState(initialPos || { lat: 19.0760, lng: 72.8777 }) // Default Mumbai
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && initialPos) {
      setPosition(initialPos)
    }
  }, [isOpen, initialPos])

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!position) return
    setLoading(true)
    try {
      // Reverse geocode using Nominatim (OpenStreetMap)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`
      )
      const data = await res.json()
      
      // Try to get a clean address
      let addressStr = data.display_name
      if (data.address) {
         const a = data.address
         const city = a.city || a.town || a.village || a.county
         addressStr = `${a.road || a.suburb || ''}, ${city || ''}`.replace(/^, /, '').trim()
      }
      
      onSelect({
        address: addressStr || "Selected Location",
        lat: position.lat,
        lng: position.lng
      })
    } catch (err) {
      // Fallback if API fails
      onSelect({
        address: `Location (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`,
        lat: position.lat,
        lng: position.lng
      })
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="font-bold text-white flex items-center gap-2">
            <MapPin size={18} className="text-brand-400" />
            Drop Pin to Select Location
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    (err) => alert("Could not fetch location. Please ensure location services are enabled.")
                  )
                }
              }}
              className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-lg hover:bg-brand-500/20 transition-colors"
            >
              Use My Location
            </button>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full bg-slate-800 relative">
          <MapContainer center={[position.lat, position.lng]} zoom={12} className="w-full h-full">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
            >
              {loading ? 'Resolving Address...' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
