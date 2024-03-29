import { Maps } from "@/components/Maps"
import { Judul } from "@/components/Elements/Judul/Judul"

import styles from "./Overview.module.css"

export const Overview = () => {
    return(
        <div className={styles.panel}>
            <Judul>Monitoring TSP</Judul>
            <div className={styles.maps_container}>
                <Maps className={styles.maps} />
            </div>
        </div>
    )
}