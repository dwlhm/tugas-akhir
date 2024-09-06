import { createLazyFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  DeviceValue,
  useDeviceValue,
  UseProfilDevice,
  useProfilDevice,
} from "../utils/useDevices";
import { Box } from "../assets/box";
import { Back } from "../assets/chevron-left";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis,Tooltip } from "recharts";
import { Sensor } from "../assets/sensor";

export const Route = createLazyFileRoute("/$deviceId")({
  component: Detail,
});

function Detail() {
  const { deviceId } = Route.useParams();

  const [profil, setProfil] = React.useState<UseProfilDevice>();
  const [data, setData] = React.useState<DeviceValue[]>([]);

  React.useEffect(() => {
    useProfilDevice(deviceId, (data?: UseProfilDevice) => {
      setProfil({ ...data });
    });
    useDeviceValue(deviceId, (data?: DeviceValue) => {
      setData((prev) => {
        if (prev[prev.length - 1]?.timestamp !== data?.timestamp)
          return [...prev, data as DeviceValue];
        return prev;
      });
    });
  }, []);
  React.useEffect(() => {
    const intv2 = setInterval(() => {
    useDeviceValue(deviceId, (data?: DeviceValue) => {
      setData((prev) => {
        if (prev[prev.length - 1]?.timestamp !== data?.timestamp)
          return [...prev, data as DeviceValue];
        return prev;
      });
    });
    }, 60000)

    return () => {
	clearInterval(intv2);
    }
  }, []);

  if (data.length <= 0) return <p>Loading...</p>;
  return (
    <div className="detail">
      <div>
        <MapContainer
          center={[
            data[data.length - 1]?.l || 0,
            data[data.length - 1]?.o || 0,
          ]}
          zoom={16}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[
              data[data.length - 1]?.l || 0,
              data[data.length - 1]?.o || 0,
            ]}
          >
            <Popup>
              <Box /> <span style={{ fontWeight: "bold"}}>{profil?.name}</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="content">
        <div className="titlebar">
          <Link to={"/"}>
            <Back />
          </Link>
          <h1>{profil?.name}</h1>
        </div>
        <p className="update">Terakhir diperbaharui pada: {new Date(data[data.length - 1]?.timestamp as string).toString()}</p>
        <DataView item={data[data.length - 1]} />
        <div className="grid">
          <Grafik item={data} title="PM 1.0" dataKey="1" />
          <Grafik item={data} title="PM 2.5" dataKey="2" />
          <Grafik item={data} title="PM 10" dataKey="0" />
          <Grafik item={data} title="PM 100" dataKey="3" />
        </div>
      </div>
    </div>
  );
}

function Grafik(props: { title: string, item: DeviceValue[], dataKey: string} ) {
  return(
    <div className="grafik">
    <h3><Sensor />{props.title}</h3>
    <ResponsiveContainer>
      <LineChart
      width={500}
      height={300}
      data={props.item.map(v => ({...v, timestamp: new Date(v?.timestamp as string).toLocaleTimeString()}))}
      >
        <CartesianGrid strokeOpacity={.5} />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip formatter={(v) => [v , props.title]} />
        <Line type={"monotone"} dataKey={props.dataKey} />
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
}

function DataView(props: { item: DeviceValue }) {
  if (props.item == undefined) return <p>Loading...</p>;
  return (
    <div className="sensor-value">
      {props.item["1"] ? (
        <div>
          <p className="title">PM 1.0</p>
          <p className="value">
            {props.item["1"]}
            <span>μg/m³</span>
          </p>
        </div>
      ) : (
        <></>
      )}
      {props.item["2"] ? (
        <div>
          <p className="title">PM 2.5</p>
          <p className="value">
            {props.item["2"]}
            <span>μg/m³</span>
          </p>
        </div>
      ) : (
        <></>
      )}
      {props.item["0"] ? (
        <div>
          <p className="title">PM 10</p>
          <p className="value">
            {props.item["0"]}
            <span>μg/m³</span>
          </p>
        </div>
      ) : (
        <></>
      )}
      {props.item["3"] && (
        <div>
          <p className="title">PM 100</p>
          <p className="value">
            {props.item["3"]}
            <span>μg/m³</span>
          </p>
        </div>
      )}
      {props.item["h"] && (
        <div>
          <p className="title">Humidity</p>
          <p className="value">
            {props.item["h"]}
            <span>%</span>
          </p>
        </div>
      )}
      {props.item["t"] && (
        <div>
          <p className="title">Suhu</p>
          <p className="value">
            {props.item["t"]}
            <span>℃</span>
          </p>
        </div>
      )}
      {props.item["v"] && (
        <div>
          <p className="title">Kecepatan Angin</p>
          <p className="value">
            {props.item["v"]}
            <span>m/s</span>
          </p>
        </div>
      )}
      {props.item["a"] && (
        <div>
          <p className="title">Arah Angin</p>
          <p className="value">
            {props.item["a"]}
            <span>°</span>
          </p>
        </div>
      )}
    </div>
  );
}
