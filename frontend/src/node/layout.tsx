import { Edit2, MapPin } from "react-feather";
import { Node, NodeUpdateResponse, updateNode } from "./api";
import { Input } from "../components/Elements/Forms";
import { BasicButton } from "../components/Elements";
import { usePopup } from "../popup";
import React, { useState } from "react";
import { useAuth, User } from "../auth/context";

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
      props.id
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
  console.log(props.item);
  if (!props.item.latest_device_value[0].value)
    return (
      <div className="mb-2 p-2 bg-white flex gap-2 rounded border-2 border-solid border-white hover:border-blue-900">
        <div className="bg-blue-100 p-1 rounded"></div>
        <div>
          <div className="flex gap-4">
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

  const item_parsed = JSON.parse(props.item.latest_device_value[0].value || "");
  const [header, body] = item_parsed.data.split("|");
  const body_arr = body.split(",");
  let res: any = {
    timestamp: new Date(
      props.item.latest_device_value[0].updatedAt
    ).toLocaleString(),
  };
  header.split("").forEach((v: any, i: number) => (res[v] = body_arr[i]));

  return (
    <div className="mb-2 p-2 bg-white flex gap-2 rounded border-2 border-solid border-white hover:border-blue-900">
      <div className="bg-blue-100 p-1 rounded"></div>
      <div>
        <div className="flex gap-4">
          <p className="text-lg">{props.item.name}</p>
          <p className="text-sm text-gray-700 mt-1">
            <MapPin className="size-3 stroke-blue-900 inline-block mr-2" />
            {props.item.address}
          </p>
          <p className="text-gray-700 text-sm flex items-center">
            Last update: {res["timestamp"]}
          </p>
        </div>
        <div className="flex gap-2">
          {res["1"] ? (
            <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
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
            <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
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
            <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
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
            <div className="bg-blue-100 py-2 px-4 mt-2 rounded">
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