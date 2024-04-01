import { useParams } from "react-router-dom"

import styles from "./Device.module.css"
import { useLocalStorage } from "@/utils/useLocalStorage"

export const Device = () => {

    const { deviceId } = useParams()
    const [ device, setDevice ] = useLocalStorage({ id: "node" })

    return(
        <div className={styles.device}>
            <p>Kita berada di {device.name}</p>
        </div>
    )
}