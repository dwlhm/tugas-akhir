import { createLazyFileRoute } from "@tanstack/react-router";
import { BackButton, BasicButton } from "../../../components/Elements";
import { useEffect, useState } from "react";
import { DeviceValue, UseProfilDevice, useProfilDevice } from "../../../utils";
import { DeviceCard, EditInfromasiNode } from "../../../node/layout";
import {
  getHistoryDevice,
  HistoryDevice,
  Node,
  NodeUpdateResponse,
} from "../../../node/api";
import { ValueByGraph } from "../../../node/component";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { Edit2 } from "react-feather";
import { usePopup } from "../../../popup";
import { useAuth, User } from "../../../auth/context";

export const Route = createLazyFileRoute("/__auth/node/$nodeId")({
  component: NodeDetail,
});

type ValuePiece = Date;

type Value = [ValuePiece, ValuePiece];

function NodeDetail() {
  const { nodeId } = Route.useParams();
  const auth = useAuth();
  const popup = usePopup<NodeUpdateResponse>();
  const [data, setData] = useState<UseProfilDevice | null>(null);
  const [dataChart, setDataChart] = useState<DeviceValue[]>([]);
  const [dataTable, setDataTable] = useState<HistoryDevice | null>(null);
  const [realtimeMode, setRealtimeMode] = useState<boolean>(true);
  const prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 6);
  const [dateRange, setDateRange] = useState<Value>([prevDate, new Date()]);
  const [offset, setOffset] = useState<number>(0);
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
    if (!realtimeMode && auth.user?.authentication_token) {
      const prev_date = new Date()
    prev_date.setDate(prev_date.getDate() - 6)
    if (!dateRange) setDateRange([prevDate, new Date()])
    console.log("dateRange", dateRange)
      const raw = getHistoryDevice(
        auth.user.authentication_token,
        nodeId,
        {
          from: !dateRange ? prev_date.toISOString() : dateRange[0].toISOString(),
          to: !dateRange ? new Date().toISOString() : dateRange[1].toISOString(),
        },
        offset
      ).then((res) => {
        if (res.body) {
          setDataTable(res.body);
        }
      });

      console.log("dateRange", raw);
    }
  }, [dateRange, offset, realtimeMode]);

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
              <DateTimeRangePicker
                onChange={(e) => setDateRange(e as Value)}
                value={dateRange}
              />
              <TableData data={dataTable} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TableData(props: { data: HistoryDevice }) {
  if (!props.data) return <p>no data.</p>
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
        {/* {JSON.stringify(props.data)} */}
        {props.data.list &&
          props.data.list.map((item, index) => {

            const data = JSON.parse(item.value)

            return (
              <tr
                key={`data.table.${index}`}
                className="grid grid-cols-10 w-full"
              >
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100 col-span-3">
                  {new Date(item.updatedAt || 0).toLocaleString()}
                </td>
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
                  {data["1"]}
                </td>
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
                  {data["2"]}
                </td>
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
                  {data["0"]}
                </td>
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
                  {data["3"] || 0}
                </td>
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100">
                  {data["t"]}
                </td>
                <td className="p-3 bg-white text-center border-b border-solid border-b-blue-100 col-span-2">
                  {data["h"]}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
