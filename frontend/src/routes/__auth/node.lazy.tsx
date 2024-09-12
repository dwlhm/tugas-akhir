import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAllNodes, Node } from "../../node/api";
import { Map, MapPin } from "react-feather";
import { DeviceCard } from "../../node/layout";

export const Route = createLazyFileRoute("/__auth/node")({
  component: NodeLayout,
});

function NodeLayout() {
  const { auth } = Route.useRouteContext();
  const param = Route.useParams();
  const [dataNode, setDataNode] = useState<Node[]>();
  useEffect(() => {
    if (auth.user)
      getAllNodes(auth.user).then((data) => {
        if (data.body) setDataNode(data.body);
      });
  }, []);
  return (
    <div>
      {Object.keys(param).length == 0 ? (
        dataNode?.map((item) => {
          // if (!item.latest_device_value[0].value)
          //   return <div key={item.id}></div>;
          // return (<div key={item.id}>{JSON.stringify(item.latest_device_value[0])}</div>)
          
          return (
            <Link
              to="/node/$nodeId"
              params={{ nodeId: item.id }}
              key={`node.${item.id}`}
            >
              <DeviceCard item={item} />
            </Link>
          );
        })
      ) : (
        <Outlet />
      )}
    </div>
  );
}
