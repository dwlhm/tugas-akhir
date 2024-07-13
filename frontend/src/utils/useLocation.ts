export type Location = {
  latitude?: number,
  longitude?: number,
  error?: any,
}
export const useLocation = (): Location => {
  if (navigator.geolocation) {
    let result: Location = {
      error: "loading"
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords

        result =  { latitude, longitude }
      },
      error => {
        result = { error: error }
      }    
    )
    return result
  } else {
    return {
      error: "geolocation is not supported by this browser"
    }
  }
}
