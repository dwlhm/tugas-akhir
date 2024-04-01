import { MapContainer } from "react-leaflet/MapContainer"
import { TileLayer } from "react-leaflet/TileLayer"             

import "leaflet/dist/leaflet.css"
import { LatLngExpression } from "leaflet"
import React, { Suspense, lazy } from "react"

const MapsPopup = lazy(() => import("./MapsPopup"))

export type MapsProps = {
    className?: string,
    coordinate?: LatLngExpression,
    children?: React.ReactNode
}

export const Maps = ({
    className = "",
    coordinate = [51.505,-0.09],
    ...props
}: MapsProps) => {
    return(
        <MapContainer className={className} center={coordinate} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {props.children}
        </MapContainer>
    )
}