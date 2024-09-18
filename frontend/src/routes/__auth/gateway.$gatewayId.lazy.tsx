import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { BackButton, BasicButton } from "../../components/Elements";
import { DeleteGateway, EditGateway, SeeCredentials } from "../../gateway/layout";
import React, { useEffect, useState } from "react";
import {
  Gateway,
  getAllGateway,
  getGateway,
  getMqttCredential,
} from "../../gateway/api";
import { useAuth } from "../../auth/context";
import { usePopup } from "../../popup";
import {
  Cpu,
  Edit2,
  Eye,
  MapPin,
  PlusCircle,
  Trash2,
} from "react-feather";
import { QuickViewCard } from "../../components/Elements/Card/component";
import { NodeBaru } from "../../node/layout";
import { getAllNodes, Node } from "../../node/api";
import { parseNodeData } from "../../node/lib";

export const Route = createLazyFileRoute("/__auth/gateway/$gatewayId")({
  component: GatewayDetailView,
});

function GatewayDetailView() {
  const auth = useAuth();
  const { gatewayId } = Route.useParams();
  const popup = usePopup();
  const [profil, setProfil] = useState<Gateway | null>(null);
  const [nodes, setNodes] = useState<Node[] | null>(null);

  useEffect(() => {
    if (auth.user && auth.user.authentication_token && gatewayId)
      getGateway(auth.user.authentication_token, gatewayId).then((data) => {
        if (data.body) setProfil(data.body);
      });
  }, []);

  useEffect(() => {
    if (auth.user && auth.user.authentication_token && gatewayId)
      getAllNodes(auth.user, gatewayId).then((data) => {
        if (data.body && data.body.length > 0) setNodes(data.body);
      });
    const gnInterval = setInterval(() => {
      if (auth.user && auth.user.authentication_token && gatewayId)
        getAllNodes(auth.user, gatewayId).then((data) => {
          if (data.body && data.body.length > 0) setNodes(data.body);
        });
    }, 60000);

    return () => clearInterval(gnInterval);
  }, []);

  const nodeBaruFunc = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (auth.user && auth.user.authentication_token && profil != null)
      getAllGateway(auth.user.authentication_token).then((data) => {
        if (data.body)
          popup.setPopup(
            <NodeBaru gateway={data.body} defaultGatewayId={profil.id} />
          );
      });
  };

  const mqttCredFunc = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (auth.user && auth.user.authentication_token && gatewayId) {
      getMqttCredential(auth.user.authentication_token, gatewayId).then(
        (data) => {
          if (data.body) popup.setPopup(<SeeCredentials data={data.body} />);
        }
      );
    }
  };
  return (
    <div>
      <div className="flex justify-between">
        <BackButton />
        <div className="flex gap-2">
          <BasicButton
            onClick={() => {
              if (profil != null)
                popup.setPopup(
                  <EditGateway
                    gatewayId={gatewayId}
                    name={profil.name as string}
                    address={profil.address as string}
                  />
                );
            }}
            className="bg-white border-white p-1"
            icon={<Edit2 className="size-2" />}
          >
            Edit Informasi Gateway
          </BasicButton>
          <BasicButton
            onClick={() => {
              if (profil != null)
                popup.setPopup(
                  <DeleteGateway
                    gatewayId={gatewayId}
                    name={profil.name as string}
                  />
                );
            }}
            className="bg-white border-red-900 p-1"
          >
            <Trash2 className="size-6 stroke-red-900 p-1 rounded" />
            Hapus Gateway 
          </BasicButton>
        </div>
      </div>
      {profil != null ? (
        <div className="my-2">
          <QuickViewCard
            name={profil.name}
            topBar={
              <p className="text-sm text-gray-700 mt-1">
                <MapPin className="size-3 stroke-blue-900 inline-block mr-2" />
                {profil.address}
              </p>
            }
          >
            <div className="flex gap-2 mt-2 flex-wrap">
              <BasicButton
                className="bg-blue-100 border-blue-200"
                onClick={nodeBaruFunc}
              >
                <PlusCircle className="size-3 stroke-2 stroke-blue-900" />
                Tambah Node
              </BasicButton>
              <BasicButton
                onClick={mqttCredFunc}
                className="bg-red-100 border-blue-100"
                padding="p-1 pr-4"
                icon={<Eye className="size-4 stroke-2 stroke-blue-900" />}
              >
                Lihat Kredensial MQTT
              </BasicButton>
            </div>
          </QuickViewCard>
        </div>
      ) : (
        <></>
      )}
      <p className="mt-5 mb-3 text-center text-lg flex gap-2  items-center justify-center">
        <Cpu className="size-5 stroke-blue-900" />
        Daftar Node Terhubung
      </p>
      {nodes != null ? (
        nodes.map((item) => (
          <Link
            to="/node/$nodeId"
            params={{ nodeId: item.id }}
            key={`g.n.l.${item.id}`}
          >
            <QuickViewCard
              name={item.name}
              noLeftDecoration={true}
              topBar={
                <p className="text-sm text-gray-700 mt-1">
                  <MapPin className="size-3 stroke-blue-900 inline-block mr-2" />
                  {item.address}
                </p>
              }
            >
              {(() => {
                const parsedData = parseNodeData(
                  item.latest_device_value[0].value
                );
                if (!parsedData)
                  return (
                    <div className="bg-red-100 py-2 px-5 mt-2 rounded border border-red-900 text-center text-sm italic">
                      hasil pembacaan sensor belum tersedia, mohon segera
                      aktifkan node.
                    </div>
                  );
                else
                  return (
                    <div className="flex gap-2">
                      {parsedData["1"] ? (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">PM 1.0</p>
                          <p className="text-base">
                            {parsedData["1"]}
                            <span className="text-sm ml-2">μg/m³</span>
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {parsedData["2"] ? (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">PM 2.5</p>
                          <p className="text-base">
                            {parsedData["2"]}
                            <span className="text-sm ml-2">μg/m³</span>
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {parsedData["0"] ? (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">PM 10</p>
                          <p className="text-base">
                            {parsedData["0"]}
                            <span className="text-sm ml-2">μg/m³</span>
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {parsedData["3"] && (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">PM 100</p>
                          <p className="text-base">
                            {parsedData["3"]}
                            <span className="text-sm ml-2">μg/m³</span>
                          </p>
                        </div>
                      )}
                      {parsedData["h"] && (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">Humidity</p>
                          <p className="text-base">
                            {parsedData["h"]}
                            <span className="text-sm ml-2">%</span>
                          </p>
                        </div>
                      )}
                      {parsedData["t"] && (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">Suhu</p>
                          <p className="text-base">
                            {parsedData["t"]}
                            <span className="text-sm ml-2">℃</span>
                          </p>
                        </div>
                      )}
                      {parsedData["v"] && (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">Kecepatan Angin</p>
                          <p className="text-base">
                            {parsedData["v"]}
                            <span className="text-sm ml-2">m/s</span>
                          </p>
                        </div>
                      )}
                      {parsedData["a"] && (
                        <div className="bg-blue-100/50 py-2 px-4 mt-2 rounded">
                          <p className="text-xs">Arah Angin</p>
                          <p className="text-base">
                            {parsedData["a"]}
                            <span className="text-sm ml-2">°</span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
              })()}
            </QuickViewCard>
          </Link>
        ))
      ) : (
        <p className="bg-red-100 py-2 px-5 mt-2 rounded border border-red-900 text-center text-sm italic">
          Tidak ada node berhubungan dengan gateway ini, mohon untuk menambah
          node yang terhubung dengan gateway ini.
        </p>
      )}
    </div>
  );
}
