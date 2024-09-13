import { createLazyFileRoute } from "@tanstack/react-router";
import { BackButton, BasicButton } from "../../../components/Elements";
import { useEffect, useState } from "react";
import { DeviceValue, UseProfilDevice, useProfilDevice } from "../../../utils";
import { DeviceCard, EditInfromasiNode } from "../../../node/layout";
import { Node, NodeUpdateResponse } from "../../../node/api";
import { ValueByGraph } from "../../../node/component";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { Edit2 } from "react-feather";
import { usePopup } from "../../../popup";
import { useAuth, User } from "../../../auth/context";

export const Route = createLazyFileRoute("/__auth/node/$nodeId")({
  component: NodeDetail,
});

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function NodeDetail() {
  const { nodeId } = Route.useParams();
  const popup = usePopup<NodeUpdateResponse>();
  const auth = useAuth();
  const [data, setData] = useState<UseProfilDevice | null>(null);
  const [dataChart, setDataChart] = useState<DeviceValue[]>([]);
  const [realtimeMode, setRealtimeMode] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<Value>([new Date(), new Date()]);
  useEffect(() => {
    useProfilDevice(nodeId, (raw, error) => {
      if (raw) {
        setData(raw);

        setDataChart((prev) => {
          if (!raw.latest_device_value[0].value) return prev;
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
            if (!raw.latest_device_value[0].value) return prev;
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

    return () => clearInterval(polling);
  }, []);

  useEffect(() => {
    console.log("popup.data", popup.data);
    if (!!popup.data)
      setData((prev_data) => {
        if (prev_data?.name) prev_data.name = popup.data.name;
        if (prev_data?.address) prev_data.address = popup.data.address;
        return {
          ...prev_data,
        } as UseProfilDevice;
      });
  }, [popup.data]);

  return (
    <div>
      <div className="flex justify-between">
        <BackButton />
        <BasicButton
          onClick={() =>
            popup.setPopup(
              <EditInfromasiNode
                id={data?.id as string}
                name={data?.name as string}
                address={data?.address as string}
              />
            )
          }
          className="bg-white border-white p-1"
          icon={<Edit2 className="size-2" />}
        >
          Edit Informasi Node
        </BasicButton>
      </div>
      <div className="my-2">{data && <DeviceCard item={data as Node} />}</div>
      {dataChart.length > 0 && (
        <>
          <div className="flex justify-center">
            <div className="flex gap-1 m-2 mx-auto bg-blue-100 p-1 rounded">
              <BasicButton
                onClick={() => setRealtimeMode(true)}
                className={
                  realtimeMode
                    ? "bg-white border-white"
                    : `bg-transparent border-transparent`
                }
              >
                Realtime
              </BasicButton>
              <BasicButton
                onClick={() => setRealtimeMode(false)}
                className={
                  !realtimeMode
                    ? "bg-white border-white"
                    : `bg-transparent border-transparent`
                }
              >
                Arsip
              </BasicButton>
            </div>
          </div>
          {realtimeMode ? (
            <div className="grid grid-cols-3 gap-2 my-2">
              <ValueByGraph item={dataChart} title="PM 1.0" dataKey="1" />
              <ValueByGraph item={dataChart} title="PM 2.5" dataKey="2" />
              <ValueByGraph item={dataChart} title="PM 10" dataKey="0" />
              <ValueByGraph item={dataChart} title="PM 100" dataKey="3" />
              <ValueByGraph item={dataChart} title="Suhu" dataKey="t" />
              <ValueByGraph
                item={dataChart}
                title="Kelembaban Udara"
                dataKey="h"
              />
            </div>
          ) : (
            <div>
              <DateTimeRangePicker onChange={setDateRange} value={dateRange} />
              <TableData dataChart={dataChart} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TableData(props: { dataChart: DeviceValue[] }) {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="grid grid-cols-10 w-full">
          <th className="px-3 py-2 bg-blue-100 text-sm rounded-tl col-span-3">
            Waktu
          </th>
          <th className="px-3 py-2 bg-blue-100 text-sm">PM 1.0</th>
          <th className="px-3 py-2 bg-blue-100 text-sm">PM 2.5</th>
          <th className="px-3 py-2 bg-blue-100 text-sm">PM 10</th>
          <th className="px-3 py-2 bg-blue-100 text-sm">PM 100</th>
          <th className="px-3 py-2 bg-blue-100 text-sm">Suhu</th>
          <th className="px-3 py-2 bg-blue-100 text-sm rounded-tr col-span-2">
            Kelembaban Udara
          </th>
        </tr>
      </thead>
      <tbody>
        {props.dataChart.map((item, index) => (
          <tr key={`data.table.${index}`} className="grid grid-cols-10 w-full">
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100 col-span-3">
              {new Date(item["timestamp"] || 0).toLocaleString()}
            </td>
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
              {item["1"]}
            </td>
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
              {item["2"]}
            </td>
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
              {item["0"]}
            </td>
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
              {item["3"] || 0}
            </td>
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
              {item["t"]}
            </td>
            <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100 col-span-2">
              {item["h"]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
