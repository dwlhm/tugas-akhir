import { createLazyFileRoute } from "@tanstack/react-router";
import { BackButton } from "../../../components/Elements";
import { useEffect, useState } from "react";
import {
  DeviceValue,
  UseProfilDevice,
  useProfilDevice,
} from "../../../utils";
import { DeviceCard } from "../../../node/layout";
import { Node } from "../../../node/api";
import { ValueByGraph } from "../../../node/component";

export const Route = createLazyFileRoute("/__auth/node/$nodeId")({
  component: NodeDetail,
});

function NodeDetail() {
  const { nodeId } = Route.useParams();
  const [data, setData] = useState<UseProfilDevice>();
  const [dataChart, setDataChart] = useState<DeviceValue[]>([]);
  useEffect(() => {
    useProfilDevice(nodeId, (raw, error) => {
      if (raw) {
        setData(raw);

        setDataChart((prev) => {
          if (
            prev[prev.length - 1]?.timestamp !==
            raw.latest_device_value[0].updatedAt
          ) {
            const item_parsed = JSON.parse(raw.latest_device_value[0].value);
            const [header, body] = item_parsed.data.split("|");
            const body_arr = body.split(",");
            let res: any = {
              timestamp: raw.latest_device_value[0].updatedAt,
            };
            header
              .split("")
              .forEach((v: any, i: number) => (res[v] = body_arr[i]));
            return [...prev, res as DeviceValue];
          }
          return prev;
        });
      } else console.error(error);
    });
    const polling = setInterval(() => {
      useProfilDevice(nodeId, (raw, error) => {
        if (raw) {
          console.log(raw);
          setData(raw);
          setDataChart((prev) => {
            if (
              prev[prev.length - 1]?.timestamp !==
              raw.latest_device_value[0].updatedAt
            ) {
              const item_parsed = JSON.parse(raw.latest_device_value[0].value);
              const [header, body] = item_parsed.data.split("|");
              const body_arr = body.split(",");
              let res: any = {
                timestamp: raw.latest_device_value[0].updatedAt,
              };
              header
                .split("")
                .forEach((v: any, i: number) => (res[v] = body_arr[i]));
              return [...prev, res as DeviceValue];
            }
            return prev;
          });
        } else console.error(error);
      });
    }, 60000);

    return clearInterval(polling);
  }, []);
  return (
    <div>
      <BackButton />
      <div className="my-2">{data && <DeviceCard item={data as Node} />}</div>
      <div className="grid grid-cols-3 gap-2">
        <ValueByGraph item={dataChart} title="PM 1.0" dataKey="1" />
        <ValueByGraph item={dataChart} title="PM 2.5" dataKey="2" />
        <ValueByGraph item={dataChart} title="PM 10" dataKey="0" />
        <ValueByGraph item={dataChart} title="PM 100" dataKey="3" />
        <ValueByGraph item={dataChart} title="Suhu" dataKey="t" />
        <ValueByGraph item={dataChart} title="Kelembaban Udara" dataKey="h" />
      </div>
    </div>
  );
}
