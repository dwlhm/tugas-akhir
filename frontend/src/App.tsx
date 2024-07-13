import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "./App.css"
import { useLocation } from './utils/useLocation'
import React from 'react'

function App() {

  const [ location, setLocation ] = React.useState<Location>({ error: "loading" })

  React.useEffect(() => {
      useLocation(
        (longitude, latitude, error) => {
          if (error == null) {
            setLocation({
              longitude: longitude,
              latitude: latitude
            })
          }  
        }  
      )
  }, [])
  
  if (location.error == "loading") return <p style={{ width: "100wh", "height": "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>Loading...</p>
  return (
  <>
    <MapContainer center={[location.longitude, location.latitude]} zoom={16} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[location.longitude, location.latitude]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
</>  
)
}

export default App
