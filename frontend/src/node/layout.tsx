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
    let eFormat = {};
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
  console.log("item_parsed", item_parsed);
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
            <div
              className={`${getISPULevel(res["2"])} bg-blue-100 py-2 px-4 mt-2 rounded`}
            >
              <p className="text-xs">PM 2.5</p>
              <p className="text-base">
                {res["2"]}
                <span className="text-sm ml-2">μg/m³</span>
              </p>
            </div>
          ) : (
            <></>
          )}
          {res["0"] ? (
            <div
              className={`${getISPULevel(res["0"])} bg-blue-100 py-2 px-4 mt-2 rounded`}
            >
              <p className="text-xs">PM 10</p>
              <p className="text-base">
                {res["0"]}
                <span className="text-sm ml-2">μg/m³</span>
              </p>
            </div>
          ) : (
            <></>
          )}
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
    </div>
  );
};

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
