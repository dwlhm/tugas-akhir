import { Maps, MapsMarker } from "@/components/Maps"
import { Judul } from "@/components/Elements/Judul/Judul"

import styles from "./Overview.module.css"
import { Link, Outlet } from "react-router-dom"
import { LatLngExpression } from "leaflet"

export const Overview = () => {

    const data = [{
        position: [51.505,-0.09],
        id: "djdjdjdj",
        name: "Node 1"
    }, {
        position: [51.508,-0.12],
        id: "sklejfod",
        name: "Node 2"
    },]
    return(
        <div className={styles.panel}>
            <Judul><Link className={styles.link} to="/">Monitoring TSP</Link></Judul>
            <div className={styles.container}>
                <div className={styles.maps_container}>
                    <Maps className={styles.maps} coordinate={data[0].position as LatLngExpression}>
                        {data.map(data => (
                            <MapsMarker position={data.position as LatLngExpression} data={data.id} name={data.name}/>
                        ))}
                    </Maps>   
                </div>
                <Outlet />
            </div>
        </div>
    )
}