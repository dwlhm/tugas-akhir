import { useLocalStorage } from "@/utils/useLocalStorage"
import { LatLngExpression } from "leaflet"
import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet"
import { useNavigate } from "react-router-dom"

export type MapsMarkerProps = {
    position: LatLngExpression
    data: string,
    name: string
}

export const MapsMarker = ({position, data, name}: MapsMarkerProps) => {

    const navigate = useNavigate()
    const [_, set] = useLocalStorage({id: "node"})

    return(
        <Marker position={position} eventHandlers={{click() {
            navigate(`/${data}`)
            set({position: position, data: data, name: name})
        }}}>
            <Tooltip direction="top" offset={[-15, 0]}>
                <>{name}</>
            </Tooltip>
        </Marker>
    )
}