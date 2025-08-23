import { Edit2, MapPin, PlusCircle } from "react-feather";
import {
  addNode,
  deleteNode,
  Node,
  NodeUpdateResponse,
  updateNode,
} from "./api";
import { Input, Select } from "../components/Elements/Forms";
import { BasicButton } from "../components/Elements";
import { usePopup } from "../popup";
import React, { useState } from "react";
import { useAuth, User } from "../auth/context";
import { Gateway } from "../gateway/api";
import { getPM10Level, getPM25Level } from "./lib";
import { Info } from "../components/icons/info";

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl w-80"
          style={{
            left: `${position.x - 160}px`, // 160px is half of w-80 (320px)
            top: `${position.y}px`   // Position below the element
          }}
        >
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          <div className="leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export const NodeBaru = (props: {
  gateway: Gateway[];
  defaultGatewayId?: string;
}) => {
  const auth = useAuth();
  const popup = usePopup<NodeUpdateResponse>();
  const putNode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawData = {
      name: (e.target as any)[0].value as string,
      address: (e.target as any)[1].value as string,
      gateway_id: (e.target as any)[2].value as string,
    };

    const response = await addNode(
      auth.user as User,
      rawData.name,
      rawData.address,
      rawData.gateway_id,
    );

    if (response.body) {
      popup.close(response.body);
      location.reload();
    }
  };
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <PlusCircle className="size-2" />
        </span>
        Tambah Node Baru
      </h3>
      <form onSubmit={putNode} className="max-w-xs">
        <Input
          name="nama"
          label="Nama Node"
          placeholder="Masukan nama node"
          type="text"
        />
        <Input
          name="alamat"
          label="Alamat Node"
          placeholder="Masukan alamat node"
          type="text"
        />
        <Select
          name="gateway"
          label="Gateway"
          defaultValue={props.defaultGatewayId}
          options={props.gateway.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
        <div className="flex justify-center gap-2">
          <BasicButton type="submit">Tambahkan</BasicButton>
          <BasicButton
            onClick={() =>
              popup.close({
                name: "props.name",
                address: "props.address",
              })
            }
            className="flex-grow flex justify-center bg-red-100 border-red-900 hover:bg-red-200"
          >
            Batalkan
          </BasicButton>
        </div>
      </form>
    </div>
  );
};

export const EditInfromasiNode = (props: {
  id: string;
  name: string;
  address: string;
}) => {
  const auth = useAuth();
  const popup = usePopup<NodeUpdateResponse>();
  const putNode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawData = {
      name: (e.target as any)[0].value as string,
      address: (e.target as any)[1].value as string,
    };

    const response = await updateNode(
      auth.user as User,
      rawData.name,
      rawData.address,
      props.id,
    );

    if (response.body) {
      popup.close(response.body);
      location.reload();
    }
  };
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <Edit2 className="size-2" />
        </span>
        Edit Informasi Node
      </h3>
      <form onSubmit={putNode} className="max-w-xs">
        <Input
          name="nama"
          label="Nama Node"
          placeholder="Masukan nama node"
          defaultValue={props.name}
          type="text"
        />
        <Input
          name="alamat"
          label="Alamat Node"
          placeholder="Masukan alamat node"
          defaultValue={props.address}
          type="text"
        />
        <div className="flex justify-center gap-2">
          <BasicButton type="submit">Simpan Perubahan</BasicButton>
          <BasicButton
            onClick={() =>
              popup.close({
                name: props.name,
                address: props.address,
              })
            }
            className="flex-grow flex justify-center bg-red-100 border-red-900 hover:bg-red-200"
          >
            Batalkan
          </BasicButton>
        </div>
      </form>
    </div>
  );
};

export const DeviceCard = (props: { item: Node }) => {
  if (
    props.item.device_history.length <= 0 ||
    !props.item.device_history[0].value
  )
    return (
      <div className="mb-2 p-2 bg-white flex gap-2 rounded border-2 border-solid border-white hover:border-blue-900">
        <div className="bg-blue-100 p-1 rounded"></div>
        <div>
          <div className="flex gap-4 flex-wrap">
            <p className="text-lg">{props.item.name}</p>
            <p className="text-sm text-gray-700 mt-1">
              <MapPin className="size-3 stroke-blue-900 inline-block mr-2" />
              {props.item.address}
            </p>
          </div>
          <div className="bg-red-100 py-2 px-5 mt-2 rounded border border-red-900 text-center text-sm italic">
            hasil pembacaan sensor belum tersedia, mohon segera aktifkan node.
          </div>
        </div>
      </div>
    );

  let item_parsed = JSON.parse(props.item.device_history[0].value || "");
  if (!item_parsed["1"]) {
    const eFormat: Record<string, any> = {};
    const devValueText = item_parsed.data.split("|");
    const devValue = devValueText[1].split(",");
    for (let i = 0; i < devValueText[0].length; i++) {
      eFormat[devValueText[0].charAt(i)] = devValue[i];
    }
    item_parsed = {
      ...item_parsed,
      ...eFormat,
    };
  }
  let res: any = {
    ...item_parsed,
    timestamp: new Date(
      props.item.device_history[0].updatedAt,
    ).toLocaleString(),
  };

  return (
    <div className="mb-2 p-2 bg-white flex gap-2 rounded border-2 border-solid border-white hover:border-blue-900">
      <div className="bg-blue-100 p-1 rounded"></div>
      <div>
        <div className="flex gap-4 flex-wrap">
          <p className="text-lg">{props.item.name}</p>
          <p className="text-sm text-gray-700 mt-1">
            <MapPin className="size-3 stroke-blue-900 inline-block mr-2" />
            {props.item.address}
          </p>
          <p className="text-gray-700 text-sm flex items-center">
            Last update: {res["timestamp"]}
          </p>
        </div>
        <div className={`flex gap-2 flex-wrap`}>
          {res["1"] ? (
            <div
              className={`${getISPULevel(res["1"])} bg-blue-100 py-2 px-4 mt-2 rounded`}
            >
              <p className="text-xs">PM 1.0</p>
              <p className="text-base">
                {res["1"]}
                <span className="text-sm ml-2">μg/m³</span>
              </p>
            </div>
          ) : (
            <></>
          )}
          {res["2"] ? (
            <PM25Card value={res["2"]} />
          ): (
              <></>
          )}
        {res["0"] ? <PM10Card value={res["0"]} /> : <></>}
        {res["3"] && (
          <div
            className={`${getISPULevel(res["3"])} bg-blue-100 py-2 px-4 mt-2 rounded`}
          >
            <p className="text-xs">PM 100</p>
            <p className="text-base">
              {res["3"]}
              <span className="text-sm ml-2">μg/m³</span>
            </p>
          </div>
        )}
        {res["h"] && (
          <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
            <p className="text-xs">Humidity</p>
            <p className="text-base">
              {res["h"]}
              <span className="text-sm ml-2">%</span>
            </p>
          </div>
        )}
        {res["t"] && (
          <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
            <p className="text-xs">Suhu</p>
            <p className="text-base">
              {res["t"]}
              <span className="text-sm ml-2">℃</span>
            </p>
          </div>
        )}
        {res["v"] && (
          <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
            <p className="text-xs">Kecepatan Angin</p>
            <p className="text-base">
              {res["v"]}
              <span className="text-sm ml-2">m/s</span>
            </p>
          </div>
        )}
        {res["a"] && (
          <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
            <p className="text-xs">Arah Angin</p>
            <p className="text-base">
              {res["a"]}
              <span className="text-sm ml-2">°</span>
            </p>
          </div>
        )}
      </div>
    </div>
    </div >
  );
};

function PM25Card({ value }: { value: string }) {
  const { level, color, text } = getPM25Level(value);

  console.log(level, color, text, 'level, color, text PM 2.5', value);

  const getTooltipContent = (value: string) => {

    return (
      <div className="space-y-2">
        <div className="text-center font-semibold text-blue-200">📋 Panduan PM25</div>
        <div className={`space-y-1 ${text} ${color} p-2 rounded`}>
          <div className={`${text} font-medium`}>Saat ini: {value} μg/m³</div>
          <div className={`${text} font-bold`}>Status: {level}</div>
        </div>
        <div className="space-y-1 mt-4">
          <div className="text-white font-semibold">Kriteria:</div>
          <div className="text-gray-900 bg-gray-300 p-1 rounded">• PM25 {'>'} 250.5 μg/m³ = <span className="text-gray-900 font-semibold">Berbahaya</span></div>
          <div className="text-red-900 bg-red-100 p-1 rounded">• PM25 150.5-250.4 µg/m³ = <span className="text-red-900 font-semibold">Sangat Tidak Sehat</span></div>
          <div className="text-blue-900 bg-blue-100 p-1 rounded">• PM25 55.5-150.4 µg/m³ = <span className="text-blue-900 font-semibold">Tidak Sehat</span></div>
          <div className="text-yellow-900 bg-yellow-100 p-1 rounded">• PM25 15.6-55.4 µg/m³ = <span className="text-yellow-900 font-semibold">Sedang</span></div>
          <div className="text-green-900 bg-green-100 p-1 rounded">• PM25 0-15.5 µg/m³ = <span className="text-green-900 font-semibold">Baik</span></div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${color} bg-blue-100 py-2 px-4 mt-2 rounded`}
    >
      <p className="text-xs">PM 2.5</p>
      <p className="text-base">
        {value}
        <span className="text-sm ml-2">μg/m³</span>
      </p>
      <Tooltip content={getTooltipContent(value)}>
        <div className={`text-xs flex items-center gap-1 mt-1 font-semibold ${text} cursor-help`}>
          <Info className="size-3 text-black" /> {level}
        </div>
      </Tooltip>
    </div>
  )
}

function PM10Card({ value }: { value: number }) {

  const { level, color, text } = getPM10Level(value);

  const getTooltipContent = (value: number) => {
    return (
      <div className="space-y-2">
        <div className="text-center font-semibold text-blue-200">📋 Panduan PM10</div>

        <div className={`space-y-1 ${text} ${color} p-2 rounded`}>
          <div className={`${text} font-medium`}>Saat ini: {value} μg/m³</div>
          <div className={`${text} font-bold`}>Status: {level}</div>
        </div>

        <div className="space-y-1 mt-4">
          <div className="text-white font-semibold">Kriteria:</div>
          <div className="text-red-900 bg-red-100 p-1 rounded">• PM10 {'>'} 75 μg/m³ = <span className="text-red-900 font-semibold">Tidak Aman</span></div>
          <div className="text-green-900 bg-green-100 p-1 rounded">• PM10 ≤ 75 μg/m³ = <span className="text-green-900 font-semibold">Aman</span></div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${color} bg-blue-100 py-2 px-4 mt-2 rounded`}
    >
      <p className="text-xs">PM 10</p>
      <p className="text-base">
        {value}
        <span className="text-sm ml-2">μg/m³</span>
      </p>
      <Tooltip content={getTooltipContent(value)}>
        <div className={`text-xs flex items-center gap-1 mt-1 font-semibold ${text} cursor-help`}>
          <Info className="size-3 text-black" /> {level}
        </div>
      </Tooltip>
    </div>
  )
}

function getISPULevel(value: number) {
  if (value >= 301) return `!bg-black text-gray-100`;
  if (value > 200) return `bg-red-400 text-black`;
  if (value > 100) return `bg-yellow-400 text-black`;
  if (value > 50) return `bg-blue-400 text-black`;
  return `bg-green-400 text-black`;
}

export const DeleteNode = (props: { nodeId: string; name: string }) => {
  const auth = useAuth();
  const popup = usePopup();
  const [errorView, setErrorView] = useState<React.ReactNode | null>(null);

  const deleteFunc = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (auth.user && auth.user.authentication_token)
      deleteNode(auth.user, props.nodeId).then((res) => {
        if (res.body) location.replace("/node");
        if (res.error)
          setErrorView(
            <p className="bg-red-100 py-2 px-5 mt-2 rounded border border-red-900 text-center text-sm italic">
              {res.error[0]}
            </p>,
          );
      });
  };
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <PlusCircle className="size-2" />
        </span>
        Hapus Node
      </h3>
      <div className="w-80">
        <p>
          Anda yakin untuk menghapus node{" "}
          <span className="bg-red-100 px-2 rounded hover:bg-red-300 italic text-sm py-1">
            {props.name}
          </span>{" "}
          dengan id{" "}
          <span className="bg-red-100 px-2 rounded mr-1 hover:bg-red-300 italic text-sm py-1">
            {props.nodeId}
          </span>
          ?
        </p>
        <div className="flex gap-2 w-full mt-5">
          <BasicButton
            onClick={deleteFunc}
            className="bg-red-900 text-white w-full flex justify-center "
          >
            Saya Yakin
          </BasicButton>
          <BasicButton
            onClick={() => popup.close({})}
            className="bg-blue-100 w-full flex justify-center"
          >
            Batalkan
          </BasicButton>
        </div>
        {errorView}
      </div>
    </div>
  );
};
