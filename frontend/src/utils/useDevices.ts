import axios from "axios"

export const useDevices = async (onChange: (data: any, error: any) => void) => {
      try {
        const { data, status } = await axios.get(`${import.meta.env.VITE_API_URL}/device`)

        console.log("data: ", data, status)

        onChange(data, null)
      } catch (error) {
        onChange(null, error)
      }
}
