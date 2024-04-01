import { LatLngExpression } from "leaflet"
import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet"
import { useNavigate } from "react-router-dom"

export type MapsMarkerProps = {
    position: LatLngExpression
    data: string
}

export const MapsMarker = ({position, data}: MapsMarkerProps) => {

    const navigate = useNavigate()

    return(
        <Marker position={position} eventHandlers={{click() {navigate(`/${data}`)}}}>
            <Tooltip direction="top" offset={[-15, 0]}>
                <>{data}</>
            </Tooltip>
        </Marker>
    )
}