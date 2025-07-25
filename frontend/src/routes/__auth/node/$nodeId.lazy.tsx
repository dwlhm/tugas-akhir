import { createLazyFileRoute } from "@tanstack/react-router";
import { BackButton, BasicButton } from "../../../components/Elements";
import { useEffect, useState } from "react";
import { DeviceValue, UseProfilDevice, useProfilDevice } from "../../../utils";
import {
  DeleteNode,
  DeviceCard,
  EditInfromasiNode,
} from "../../../node/layout";
import {
  getHistoryDevice,
  HistoryDevice,
  Node,
  NodeUpdateResponse,
} from "../../../node/api";
import { ValueByGraph } from "../../../node/component";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { Edit2, Trash2 } from "react-feather";
import { usePopup } from "../../../popup";
import { useAuth } from "../../../auth/context";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

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
  const [realtimeMode, setRealtimeMode] = useState<boolean>(false);
  const prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 6);
  const [dateRange, setDateRange] = useState<Value>([prevDate, new Date()]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(100);
  useEffect(() => {
    useProfilDevice(nodeId + "?len=10", (raw, error) => {
      if (raw) {
        setData(raw);

        setDataChart((prev) => {
          if (raw.device_history.length === 0) return prev;
          if (!raw.device_history[0].value) return prev;
          if (
            prev[0]?.timestamp !==
            raw.device_history[raw.device_history.length - 1].updatedAt
          ) {
            const data = raw.device_history
              .map((item) => {
                const item_parsed = JSON.parse(item.value);
                return {
                  ...item_parsed,
                  timestamp: item.updatedAt,
                };
              })
              .reverse();
            return [...prev, ...data];
          }
          return prev;
        });
      } else console.error(error);
    });
    const polling = setInterval(() => {
      useProfilDevice(nodeId, (raw, error) => {
        if (raw) {
          setData(raw);
          setDataChart((prev) => {
            if (!raw.device_history[0].value) return prev;
            if (prev[0]?.timestamp !== raw.device_history[0].updatedAt) {
              const item_parsed = JSON.parse(raw.device_history[0].value);
              const res: any = {
                ...item_parsed,
                timestamp: raw.device_history[0].updatedAt,
              };
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
      const prev_date = new Date();
      prev_date.setDate(prev_date.getDate() - 6);
      if (!dateRange) setDateRange([prevDate, new Date()]);
      getHistoryDevice(
        auth.user.authentication_token,
        nodeId,
        {
          from: !dateRange
            ? prev_date.toISOString()
            : dateRange[0].toISOString(),
          to: !dateRange
            ? new Date().toISOString()
            : dateRange[1].toISOString(),
        },
        offset,
        limit,
      ).then((res) => {
        if (res.body) {
          setDataTable(res.body);
        }
      });
    }
  }, [dateRange, offset, realtimeMode, limit]);

  return (
    <div>
      <div className="flex justify-between flex-wrap gap-2">
        <BackButton />
        <div className="flex gap-2">
          <BasicButton
            onClick={() =>
              popup.setPopup(
                <EditInfromasiNode
                  id={data?.id as string}
                  name={data?.name as string}
                  address={data?.address as string}
                />,
              )
            }
            className="bg-white border-white p-1"
            icon={<Edit2 className="size-2" />}
          >
            Edit Informasi Node
          </BasicButton>
          <BasicButton
            onClick={() => {
              if (data?.name != null)
                popup.setPopup(<DeleteNode nodeId={nodeId} name={data.name} />);
            }}
            className="bg-white border-red-900 p-1"
          >
            <Trash2 className="size-6 stroke-red-900 p-1 rounded" />
            Hapus Node
          </BasicButton>
        </div>
      </div>
      <div className="my-2 lg:grid grid-cols-3">
        <div className="col-span-2">
          {data && <DeviceCard item={data as Node} />}
        </div>
        <div className="ml-2 h-44 lg:h-auto rounded mb-2 bg-white overflow-hidden border-2 shadow border-white border-solid">
          {!dataChart[dataChart.length - 1]?.l ? (
            !data ? (
              <p className="flex items-center justify-center h-full italic text-sm animate-pulse">
                memuat data lokasi...
              </p>
            ) : (
              <p className="flex items-center justify-center h-full italic text-sm bg-red-100 text-center p-2">
                Gagal mendapatkan data lokasi, harap periksa gps pada node!
              </p>
            )
          ) : (
            <MapContainer
              className="detail"
              center={[
                Number(dataChart[dataChart.length - 1]?.l || 0),
                Number(dataChart[dataChart.length - 1]?.o || 0),
              ]}
              zoom={50}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  Number(dataChart[dataChart.length - 1]?.l || 0),
                  Number(dataChart[dataChart.length - 1]?.o || 0),
                ]}
              >
                <Popup>
                  <span className="capitalize italic m-0 font-semibold">
                    {data?.name}
                  </span>
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 my-2">
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
              <div className="flex justify-between items-center">
                <DateTimeRangePicker
                  onChange={(e) => setDateRange(e as Value)}
                  value={dateRange}
                />
                <a
                  className="text-blue-500 bg-white rounded-lg px-4 py-2 my-2 text-sm transition hover:bg-blue-100"
                  href={`${import.meta.env.VITE_API_URL}/device/${nodeId}/history/csv?from=${dateRange[0].toISOString()}&to=${dateRange[1].toISOString()}`}
                >
                  Download
                </a>
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded mx-1 my-3 sticky top-5 flex justify-between items-center">
                <form>
                  <input
                    className="border border-blue-500 bg-[#fdfdfd] pl-2 text-sm py-2 rounded w-16 text-center"
                    type="number"
                    defaultValue={limit}
                    onChange={(e) =>
                      setLimit(
                        e.target.value == "" ? 1 : Number(e.target.value),
                      )
                    }
                  />
                </form>
                <div className="flex flex-wrap justify-end">
                  <button
                    onClick={() => setOffset(0)}
                    className={`bg-blue-100 rounded py-1 px-3 text-sm m-1 border ${offset + 1 == 1 ? "border-blue-500" : "border-blue-100"} hover:border-blue-900`}
                  >
                    1
                  </button>
                  {dataTable ? (
                    Math.ceil(dataTable.total / limit) > 1 ? (
                      <>
                        {offset < 3 ? (
                          <></>
                        ) : (
                          <p className="m-1 inline-block">...</p>
                        )}
                        {Math.ceil(dataTable.total / limit) > 2 && (
                          <>
                            {[...Array(9)].map((_, i) => {
                              const num =
                                offset > 2
                                  ? offset >
                                    Math.ceil(dataTable.total / limit) - 10
                                    ? i +
                                    (Math.ceil(dataTable.total / limit) - 9)
                                    : i + offset
                                  : i + 2;
                              return (
                                <button
                                  key={`data.table.${i}`}
                                  onClick={() => setOffset(num - 1)}
                                  className={`bg-blue-100 rounded py-1 px-3 text-sm m-1 border ${offset + 1 == num ? "border-blue-500" : "border-blue-100"} hover:border-blue-900`}
                                >
                                  {num}
                                </button>
                              );
                            })}
                            {offset >
                              Math.ceil(dataTable.total / limit) - 10 ? (
                              <></>
                            ) : (
                              <p className="m-1 inline-block">...</p>
                            )}
                          </>
                        )}
                        <button
                          onClick={() =>
                            setOffset(Math.ceil(dataTable.total / limit) - 1)
                          }
                          className={`bg-blue-100 rounded py-1 px-3 text-sm m-1 border ${offset + 1 == Math.ceil(dataTable.total / limit) ? "border-blue-500" : "border-blue-100"} hover:border-blue-900`}
                        >
                          {Math.ceil(dataTable.total / limit)}
                        </button>
                      </>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <TableData data={dataTable as HistoryDevice} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TableData(props: { data: HistoryDevice }) {
  if (!props.data) return <p>no data.</p>;
  return (
    <table className="border-collapse w-full min-w-96">
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
            const data = JSON.parse(item.value);

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
