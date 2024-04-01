import { useParams } from "react-router-dom"

export const Device = () => {

    const { deviceId } = useParams()

    return(
        <div>
            <p>Kita berada di {deviceId}</p>
        </div>
    )
}