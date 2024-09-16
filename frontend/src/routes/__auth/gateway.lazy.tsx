import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gateway, getAllGateway } from "../../gateway/api";
import { useAuth } from "../../auth/context";
import { QuickViewCard } from "../../components/Elements/Card/component";
import { MapPin } from "react-feather";
import { NodeIc } from "../../components/icons";

export const Route = createLazyFileRoute("/__auth/gateway")({
  component: GatewayView,
});

function GatewayView() {
  const auth = useAuth();
  const [listGateway, setListGateway] = useState<Gateway[]>([]);
  useEffect(() => {
    if (auth.user && auth.user.authentication_token)
      getAllGateway(auth.user.authentication_token).then((data) => {
        if (data.body) setListGateway(data.body);
      });
  }, []);
  return (
    <div>
      {!listGateway ? (
        <></>
      ) : (
        listGateway.map((gateway) => (
          <Link to="/gateway/$gatewayId" params={{ gatewayId: gateway.id }}>
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
              {!gateway.device ? (
                <></>
              ) : (
                gateway.device.map((item) => <Link to="/node/$nodeId" params={{ nodeId: item.id}} className="bg-blue-100 px-3 py-2 rounded text-xs text-blue-900 hover:bg-blue-100/50"><NodeIc className="size-3 stroke-blue-900 inline-block mr-2" />{item.name}</Link>)
              )}
              </div>
            </QuickViewCard>
          </Link>
        ))
      )}
    </div>
  );
}
