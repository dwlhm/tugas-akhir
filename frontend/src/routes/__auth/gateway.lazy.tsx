import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { Gateway, getAllGateway } from "../../gateway/api";
import { useAuth } from "../../auth/context";
import { QuickViewCard } from "../../components/Elements/Card/component";
import { MapPin, PlusCircle } from "react-feather";
import { NodeIc } from "../../components/icons";
import { BasicButton } from "../../components/Elements";
import { GatewayBaru } from "../../gateway/layout";
import { usePopup } from "../../popup";

export const Route = createLazyFileRoute("/__auth/gateway")({
  component: GatewayView,
});

function GatewayView() {
  const auth = useAuth();
  const param = Route.useParams();
  const { setPopup } = usePopup();
  const [listGateway, setListGateway] = useState<Gateway[]>([]);
  useEffect(() => {
    if (auth.user && auth.user.authentication_token)
      getAllGateway(auth.user.authentication_token).then((data) => {
        if (data.body) setListGateway(data.body);
      });
  }, []);
  const addgatewayFunc = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    setPopup: (el: JSX.Element) => void
  ) => {
    e.preventDefault();

    setPopup(<GatewayBaru />);
  };
  return (
    <div>
      {Object.keys(param).length == 0 ? (
        <>
          <BasicButton
            onClick={(e) =>
              auth.user?.authentication_token && addgatewayFunc(e, setPopup)
            }
            className="bg-white border-blue-100 mb-2 pr-5 text-blue-900 ml-auto mr-0"
            icon={<PlusCircle className="size-4" />}
          >
            Gateway Baru
          </BasicButton>
          {!listGateway ? (
            <></>
          ) : (
            listGateway.map((gateway) => (
              <Link
                to="/gateway/$gatewayId"
                params={{ gatewayId: gateway.id }}
                key={`g.l.${gateway.id}`}
              >
                <QuickViewCard
                  name={gateway.name}
                  topBar={
                    <p className="text-sm text-gray-700 mt-1">
                      <MapPin className="size-3 stroke-blue-900 inline-block mr-2" />
                      {gateway.address}
                    </p>
                  }
                >
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {gateway.device ? (
                      gateway.device?.length <= 0 ? (
                        <div className="bg-red-100 py-2 px-3 rounded border border-red-900 text-center text-xs italic">
                          Tidak ada node terdaftar dengan gateway
                        </div>
                      ) : (
                        gateway.device.map((item) => (
                          <div
                            key={`g.n.l.m.${item.id}`}
                            className="bg-blue-100 px-3 py-2 rounded text-xs text-blue-900 hover:bg-blue-100/50"
                          >
                            <NodeIc className="size-3 stroke-blue-900 inline-block mr-2" />
                            {item.name}
                          </div>
                        ))
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </QuickViewCard>
              </Link>
            ))
          )}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
