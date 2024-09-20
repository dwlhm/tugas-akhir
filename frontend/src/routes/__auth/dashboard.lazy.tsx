import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DeviceDetail, Location, useLocation } from "../../utils";
import { DataCardSecured } from "../../components/data.card";
import { useAuth } from "../../auth/context";
import { getAllLatestValue } from "../../node/api";

export const Route = createLazyFileRoute("/__auth/dashboard")({
  component: DashboardView,
});

function DashboardView() {
  const auth = useAuth()
  const [location, setLocation] = useState<Location>({
    error: "loading",
  });
  const [devices, setDevices] = useState<DeviceDetail[]>([]);
  useEffect(() => {
    if (auth.user && auth.user.authentication_token)
      getAllLatestValue(auth.user.authentication_token).then((data) => {
        if (data.body) {
          const hasil: DeviceDetail[] = data.body.map((item) => {
            return {
              id: item.id,
              name: item.name,
              value: JSON.parse(item.value),
              timestamp: item.createdAt,
            };
          });

          setDevices(hasil);
        }
      });

    const intv1 = setInterval(() => {
      if (auth.user && auth.user.authentication_token)
        getAllLatestValue(auth.user.authentication_token).then((data) => {
          if (data.body) {
            const hasil: DeviceDetail[] = data.body.map((item) => {
              return {
                id: item.id,
                name: item.name,
                value: JSON.parse(item.value),
                timestamp: item.createdAt,
              };
            });

            setDevices(hasil);
          }
        });
    }, 60000);

    return () => {
      clearInterval(intv1);
    };
  }, []);
  useEffect(() => {
    useLocation((longitude, latitude, error) => {
      if (error == null) {
        setLocation({
          longitude: longitude,
          latitude: latitude,
        });
      }
    });
  }, []);

  if (location.error == "loading")
    return (
      <p
        style={{
          width: "100wh",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Loading...
      </p>
    );
  return (
    <div id="dashboard-map" className="mb-5 h-64">
      <MapContainer
      className="h-32"
        center={[location?.longitude as number, location?.latitude as number]}
        zoom={14}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices &&
          devices.map((v) => (
            <Marker
              key={v.id}
              position={[
                v.value.l || (location.longitude as number),
                v.value.o || (location.latitude as number),
              ]}
            >
              <Popup>
                <DataCardSecured data={v} />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
