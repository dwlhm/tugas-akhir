import { useParams } from "react-router-dom"

import styles from "./Device.module.css"

export const Device = () => {

    const { deviceId } = useParams()

    return(
        <div className={styles.device}>
            <p>Kita berada di {deviceId}</p>
        </div>
    )
}