export type Location = {
  latitude?: number,
  longitude?: number,
  error?: any,
}
export const useLocation = (onChange: (longitude, latitude, error) => void): Location => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords

        onChange(latitude, longitude, null)
      },
      error => {
        onChange(null, null, error)
      }    
    )
  } else {
    onChange(null, null, "geolocation is not supported by this browser")
  }
}
