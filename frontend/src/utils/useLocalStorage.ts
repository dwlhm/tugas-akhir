import { MapsMarkerProps } from "@/components/Maps"

type LocalStorageProps = {
    id: string
}

export const useLocalStorage = ({id}: LocalStorageProps): [MapsMarkerProps | null, (new_data: any) => void] => {

    const get = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id) || "") as MapsMarkerProps : null

    function set(new_data: any) {
        localStorage.setItem(id, JSON.stringify(new_data))
    }

    return [get, set]
}