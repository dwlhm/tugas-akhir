import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "./App.css"
import { useLocation } from './utils/useLocation'
import React from 'react'

function App() {

  const [ location, setLocation ] = React.useState<Location>({ error: "loading" })

  React.useEffect(() => {
    const raw_loc = useLocation()

    if (!raw_loc.error) {
      setLocation({...raw_loc})
    }
  }, [])
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
  )
}

export default App
