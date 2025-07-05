import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { Dashboard, Gateway, NodeIc, User } from "../components/icons";
import { ChevronRight, Menu, X } from "react-feather";
import { usePopup } from "../popup";
import { BasicButton } from "../components/Elements";
import React, { useState } from "react";
import { KeteranganISPU } from "../components/Elements/ISPU/KeteranganISPU";

export const Route = createFileRoute("/__auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user?.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

const isMenuActive = (location: string, path: string): string => {
  return location.includes(path) ? "bg-blue-500 text-gray-100" : "";
};

function AuthLayout() {
  const location = useLocation();
  const { auth } = Route.useRouteContext();
  const popup = usePopup();
  const [menu, setMenu] = useState<boolean>(false);

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setMenu((last) => !last);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
        <nav
          className={`rounded p-5 w-full sm:w-64 flex flex-col justify-between sticky top-0 bottom-0 left-0 ${!menu ? "h-screen" : "h-full"} sm:h-screen z-[10000]`}
        >
          <div className="rounded bg-white p-2 h-full border-4 box-shadow flex justify-between flex-col">
            <div>
              <div className="flex justify-between">
                <BasicButton
                  onClick={toggleMenu}
                  className={`border-white block sm:hidden`}
                >
                  {menu ? (
                    <Menu className="size-5" />
                  ) : (
                    <X className="size-5" />
                  )}
                </BasicButton>
                <header className="flex-grow">
                  <h1 className="text-2xl text-blue-900 font-poppins font-semibold text-center py-5">
                    Monitoring Udara
                  </h1>
                </header>
              </div>
              <nav
                className={`my-5 flex flex-col gap-2 text-poppins ${!menu ? "block" : "hidden"} sm:block`}
              >
                <Link
                  to="/dashboard"
                  onClick={() => setMenu((last) => !last)}
                  className={`py-3 pr-5 pl-3 hover:bg-blue-500 rounded hover:text-blue-100 flex gap-4 items-center ${isMenuActive(location.href, "/dashboard")}`}
                >
                  <span className="p-2 bg-blue-100 rounded">
                    <Dashboard className="size-5 stroke-blue-900" />
                  </span>
                  Dashboard
                </Link>
                <Link
                  to="/node"
                  onClick={() => setMenu((last) => !last)}
                  className={`py-3 pr-5 pl-3 hover:bg-blue-500 rounded hover:text-blue-100 flex gap-4 items-center ${isMenuActive(location.href, "/node")}`}
                >
                  <span className="p-2 bg-blue-100 rounded">
                    <NodeIc className="size-5 stroke-blue-900" />
                  </span>
                  Node
                </Link>
                <Link
                  to="/gateway"
                  onClick={() => setMenu((last) => !last)}
                  className={`py-3 pr-5 pl-3 hover:bg-blue-500 rounded hover:text-blue-100 flex gap-4 items-center ${isMenuActive(location.href, "/gateway")}`}
                >
                  <span className="p-2 bg-blue-100 rounded">
                    <Gateway className="size-5 stroke-blue-900" />
                  </span>
                  Gateway
                </Link>
                <Link
                  to="/user"
                  onClick={() => setMenu((last) => !last)}
                  className={`py-3 pr-5 pl-3 hover:bg-blue-500 rounded hover:text-blue-100 flex gap-4 items-center ${isMenuActive(location.href, "/user")}`}
                >
                  <span className="p-2 bg-blue-100 rounded">
                    <User className="size-5 stroke-blue-900" />
                  </span>
                  User
                </Link>
              </nav>
            </div>
            <div>
              <KeteranganISPU />
                            {/* <Link */}
              {/*   className={`bg-blue-100 p-5 rounded border-2 border-solid border-blue-100 hover:border-blue-900 ${!menu ? "block" : "hidden"} sm:block`} */}
              {/*   to="/user" */}
              {/*   onClick={() => setMenu((last) => !last)} */}
              {/* > */}
              {/*   <div className="flex gap-4"> */}
              {/*     <div> */}
              {/*       <div className="bg-blue-200 p-1 rounded"> */}
              {/*         <User className="size-5 stroke-blue-900" /> */}
              {/*       </div> */}
              {/*     </div> */}
              {/*     <div> */}
              {/*       <p className="text-poppins text-blue-900 font-semibold"> */}
              {/*         {auth.user?.name} */}
              {/*       </p> */}
              {/*       <p className="text-poppins text-blue-900 text-sm"> */}
              {/*         {auth.user?.email?.length || 0 >= 13 */}
              {/*           ? `${auth.user?.email?.slice(0, 13)} ..` */}
              {/*           : auth.user?.email} */}
              {/*       </p> */}
              {/*     </div> */}
              {/*   </div> */}
              {/* </Link> */}
            </div>
          </div>
        </nav>
        <div
          className={`flex-grow py-5 pr-5 pl-5 sm:pl-0 ${!menu ? "hidden" : "block"} sm:block`}
        >
          <header className="text-xl font-poppins text-blue-900 flex mb-4">
            <div className="flex items-center gap-2 bg-white/50 p-2 pr-5 rounded border-2 border-solid border-white hover:border-blue-900 capitalize">
              <span className="p-2 bg-blue-100 rounded">
                {location.pathname.includes("dashboard") && (
                  <Dashboard className="size-5 stroke-blue-900" />
                )}
                {location.pathname.includes("node") && (
                  <NodeIc className="size-5 stroke-blue-900" />
                )}
                {location.pathname.includes("gateway") && (
                  <Gateway className="size-5 stroke-blue-900" />
                )}
                {location.pathname.includes("user") && (
                  <User className="size-5 stroke-blue-900" />
                )}
              </span>
              {location.pathname.split("/").map((item, index) =>
                index > 1 ? (
                  <span
                    className="flex gap-2 items-center"
                    key={`name.${index}`}
                  >
                    <ChevronRight />
                    {item != "edit" ? "Detail" : item}
                  </span>
                ) : (
                  <span className="font-semibold" key={`name.${index}`}>
                    {item}
                  </span>
                )
              )}
            </div>
            <div className="grow"></div>
          </header>
          <Outlet />
        </div>
      </div>
      {popup.el}
    </>
  );
}



