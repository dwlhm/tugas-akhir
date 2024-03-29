import { MapContainer } from "react-leaflet/MapContainer"
import { TileLayer } from "react-leaflet/TileLayer"
import { Marker } from "react-leaflet/Marker"
import { Popup } from "react-leaflet/Popup"

import "leaflet/dist/leaflet.css"
import { LatLngExpression } from "leaflet"
import React from "react"

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
            <Marker position={coordinate}>
                <Popup>
                    Dwi Ilham Maulana
                </Popup>
            </Marker>
            {props.children}
        </MapContainer>
    )
}