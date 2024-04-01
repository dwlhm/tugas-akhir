import { Marker } from "react-leaflet/Marker"
import { Popup } from "react-leaflet/Popup"
import { Suspense } from "react"

import { Maps, MapsMarker } from "@/components/Maps"
import { Judul } from "@/components/Elements/Judul/Judul"

import styles from "./Overview.module.css"

export const Overview = () => {
    return(
        <div className={styles.panel}>
            <Judul>Monitoring TSP</Judul>
            <div className={styles.maps_container}>
                <Maps className={styles.maps}>
                    <MapsMarker position={[51.505,-0.09]} data="djdjdj" />
                </Maps>
            </div>
        </div>
    )
}