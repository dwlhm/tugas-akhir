import { useParams } from "react-router-dom"

import styles from "./Device.module.css"
import { useLocalStorage } from "@/utils/useLocalStorage"
import { Card } from "@/components/Elements"

export const Device = () => {

    const { deviceId } = useParams()
    const [ device, setDevice ] = useLocalStorage({ id: "node" })

    console.log(deviceId,device?.data)

    if (device?.data !== deviceId) return(<div>Mohon maaf terdapat ketidaksinkronan data, silakan kembali ke beranda dan pilih node yang anda maksudkan.</div>)
    if (device == null) return(<div>Mohon maaf, mohon pilih node terlebih dahulu.</div>)

    return(
        <div className={styles.device}>
            <div className={styles.container}>
                <p className={styles.label}>Nama Node:</p>
                <p className={styles.judul}>{device?.name}<span className={styles.device_id}>({device?.data})</span></p>
            </div>
            <div className={styles.container}>
                <h2 className={styles.label}>Live Data:</h2>
                <div className={styles.card_container}>
                    <Card size="square" className={styles.card}>
                        <p className={styles.label}>PM 1.0:</p>
                        <p className={`${styles.judul} ${styles.jc}`}>10 µg/m³</p>
                    </Card>
                    <Card size="square" className={styles.card}>
                        <p className={styles.label}>PM 2.5:</p>
                        <p className={`${styles.judul} ${styles.jc}`}>20 µg/m³</p>
                    </Card>
                </div>
                <div className={styles.card_container}>
                    <Card size="square" className={styles.card}>
                        <p className={styles.label}>PM 10:</p>
                        <p className={`${styles.judul} ${styles.jc}`}>30 µg/m³</p>
                    </Card>
                    <Card size="square" className={styles.card}>
                        <p className={styles.label}>PM 100:</p>
                        <p className={`${styles.judul} ${styles.jc}`}>40 µg/m³</p>
                    </Card>
                </div>
            </div>
        </div>
    )
}