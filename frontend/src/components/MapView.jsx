import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const CITY_COORDS = {
  Nashik: [19.9975, 73.7898],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Nagpur: [21.1458, 79.0882],
  Aurangabad: [19.8762, 75.3433],
  Thane: [19.2183, 72.9781],
}

const loadIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#f59e0b;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 15px #f59e0b, 0 0 30px #f59e0b"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const vehicleIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#0ea5e9;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 15px #0ea5e9, 0 0 30px #0ea5e9"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const matchIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#10b981;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 20px #10b981, 0 0 40px #10b981"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function coordsFor(city) {
  return CITY_COORDS[city] || CITY_COORDS.Pune
}

export default function MapView({ loads = [], vehicles = [], selectedMatch }) {
  const center = coordsFor(loads[0]?.pickup || 'Pune')

  const matchedVehicle = selectedMatch
    ? vehicles.find((v) => v._id === selectedMatch.vehicleId)
    : null

  const matchedLoad = selectedMatch
    ? loads.find((l) => l._id === selectedMatch.loadId)
    : null

  const route =
    matchedVehicle && matchedLoad
      ? [
          coordsFor(matchedVehicle.currentLocation),
          coordsFor(matchedLoad.pickup),
          coordsFor(matchedLoad.drop),
        ]
      : []

  return (
    <div className="h-full w-full">
      <MapContainer center={center} zoom={7} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {loads.map((load) => (
          <Marker key={load._id} position={coordsFor(load.pickup)} icon={loadIcon}>
            <Popup>
              Load: {load.weight}kg {load.cargoType}
              <br />
              {load.pickup} → {load.drop}
            </Popup>
          </Marker>
        ))}

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle._id}
            position={coordsFor(vehicle.currentLocation)}
            icon={vehicle._id === selectedMatch?.vehicleId ? matchIcon : vehicleIcon}
          >
            <Popup>
              {vehicle.vehicleNumber}
              <br />
              {vehicle.currentLocation} → {vehicle.destination}
            </Popup>
          </Marker>
        ))}

        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: '#10b981', weight: 4, opacity: 0.8, dashArray: '10, 10' }} />
        )}
      </MapContainer>
    </div>
  )
}
