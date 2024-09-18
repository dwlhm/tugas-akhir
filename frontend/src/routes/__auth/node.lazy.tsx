import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAllNodes, Node } from "../../node/api";
import { DeviceCard, NodeBaru } from "../../node/layout";
import { usePopup } from "../../popup";
import { BasicButton } from "../../components/Elements";
import { PlusCircle } from "react-feather";
import { getAllGateway } from "../../gateway/api";

export const Route = createLazyFileRoute("/__auth/node")({
  component: NodeLayout,
});

function NodeLayout() {
  const { auth } = Route.useRouteContext();
  const { setPopup } = usePopup();
  const param = Route.useParams();
  const [dataNode, setDataNode] = useState<Node[]>();
  useEffect(() => {
    if (auth.user)
      getAllNodes(auth.user).then((data) => {
        if (data.body) setDataNode(data.body);
      });

    let devicePolling = setInterval(() => {
      if (auth.user)
        getAllNodes(auth.user).then((data) => {
          if (data.body) setDataNode(data.body);
        });
    }, 60000);

    return () => clearInterval(devicePolling);
  }, []);
  return (
    <div>
      {Object.keys(param).length == 0 ? (
        <>
          <BasicButton
            onClick={(e) =>
              auth.user?.authentication_token &&
              addNodeFunc(e, setPopup, auth.user?.authentication_token)
            }
            className="bg-white border-blue-100 mb-2 pr-5 text-blue-900 ml-auto mr-0"
            icon={<PlusCircle className="size-4" />}
          >
            Node Baru
          </BasicButton>
          {dataNode?.map((item) => {
            return (
              <Link
                to="/node/$nodeId"
                params={{ nodeId: item.id }}
                key={`node.${item.id}`}
              >
                <DeviceCard item={item} />
              </Link>
            );
          })}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

const addNodeFunc = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  setPopup: (el: JSX.Element) => void,
  token: string
) => {
  e.preventDefault();

  getAllGateway(token).then((data) => {
    console.log("Data gateway", data);
    if (data.body) setPopup(<NodeBaru gateway={data.body} />);
  });
};
