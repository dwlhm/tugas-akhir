import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DeviceDetail } from "../utils/useDevices";
import { DataCard } from "../components/data.card";
import { Location, useLocation } from "../utils/useLocation";
import { getAllLatestValueGeneral } from "../node/api";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [location, setLocation] = React.useState<Location>({
    error: "loading",
  });
  const [devices, setDevices] = React.useState<DeviceDetail[]>([]);

  React.useEffect(() => {
    getAllLatestValueGeneral().then((data) => {
      if (data.body) {
        let repo: DeviceDetail[] = [];
        data.body
          .filter((v: any) => typeof v.latest_device_value[0] != "undefined")
          .forEach((v: any) => {
            let item = v.latest_device_value[0];
            const item_parsed = JSON.parse(item.value);
            if (item_parsed == null) return;
            const [header, body] = item_parsed.data.split("|");
            const body_arr = body.split(",");
            let res: any = {};
            header
              .split("")
              .forEach((v: any, i: number) => (res[v] = body_arr[i]));

            repo.push({
              id: v.id,
              name: v.name,
              value: res,
              timestamp: new Date(item.updatedAt).toLocaleString(),
            });
          });

        setDevices(repo);
      }
    });

    const intv1 = setInterval(() => {
      getAllLatestValueGeneral().then((data) => {
        if (data.body) {
          let repo: DeviceDetail[] = [];
          data.body
            .filter((v: any) => typeof v.latest_device_value[0] != "undefined")
            .forEach((v: any) => {
              let item = v.latest_device_value[0];
              const item_parsed = JSON.parse(item.value);
              if (item_parsed == null) return;
              const [header, body] = item_parsed.data.split("|");
              const body_arr = body.split(",");
              let res: any = {};
              header
                .split("")
                .forEach((v: any, i: number) => (res[v] = body_arr[i]));

              repo.push({
                id: v.id,
                name: v.name,
                value: res,
                timestamp: new Date(item.updatedAt).toLocaleString(),
              });
            });

          setDevices(repo);
        }
      });
    }, 60000);

    return () => {
      clearInterval(intv1);
    };
  }, []);
  React.useEffect(() => {
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
    <>
      <MapContainer
        center={[location?.longitude as number, location?.latitude as number]}
        zoom={13}
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
                <DataCard data={v} />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </>
  );
}
