export type Location = {
  latitude?: number;
  longitude?: number;
  error?: any;
};
export const useLocation = (
  onChange: (longitude?: number, latitude?: number, error?: any) => void
): void => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        onChange(latitude, longitude, null);
      },
      (error) => {
        onChange(undefined, undefined, error);
      }
    );
  } else {
    onChange(
      undefined,
      undefined,
      "geolocation is not supported by this browser"
    );
  }
};
