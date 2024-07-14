import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "./App.css"
import { useLocation, Location } from './utils/useLocation'
import { useDevices } from './utils/useDevices'
import { DataCard } from './components/data.card.tsx'
import React from 'react'

function App() {

  const [ location, setLocation ] = React.useState<Location>({ error: "loading" })
  const [ devices, setDevices ] = React.useState(null)

  React.useEffect(() => {
    useDevices((data, error) => {
      if (data) {
        setDevices(data.body
          .filter(v => typeof v.latest_device_value[0] != "undefined")
          .map(v => {
            let item = v.latest_device_value[0]
            const item_parsed = JSON.parse(item.value)
            const [header, body] = item_parsed.data.split("|")
            const body_arr = body.split(",")
            let res = {} 
            header.split("").forEach((v,i) => res[v] = body_arr[i])
            return {
              id: v.id,
              name: v.name,
              value: res,
              timestamp: new Date(item.updatedAt).toLocaleString()
            }
          })
        )
      }
      if (error) console.error(error)
    })
    
    setInterval(() => {
      useDevices((data, error) => {
      if (data) {
        setDevices(data.body
          .filter(v => typeof v.latest_device_value[0] != "undefined")
          .map(v => {
            let item = v.latest_device_value[0]
            const item_parsed = JSON.parse(item.value)
            const [header, body] = item_parsed.data.split("|")
            const body_arr = body.split(",")
            let res = {} 
            header.split("").forEach((v,i) => res[v] = body_arr[i])
            return {
              id: v.id,
              name: v.name,
              value: res,
              timestamp: new Date(item.updatedAt).toLocaleString()
            }
          })
        )
      }
      if (error) console.error(error)
    })
    }, 60000)
  }, [])
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
    <MapContainer center={[location?.longitude as number, location?.latitude as number]} zoom={16} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {
    devices.map(v => (
      <Marker key={v.id} position={[v.value.l || location.longitude as number, v.value.o || location.latitude as number]}>
        <Popup>
          <DataCard data={v} />
        </Popup>
      </Marker>
    ))
  }
  </MapContainer>
</>  
)
}

export default App
