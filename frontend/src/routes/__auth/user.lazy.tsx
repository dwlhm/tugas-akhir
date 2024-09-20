import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { AlignLeft, AtSign, LogOut, UserPlus } from "react-feather";
import React, { useEffect } from "react";
import { usePopup } from "../../popup";
import { NewUser } from "../../user/layout";

export const Route = createLazyFileRoute("/__auth/user")({
  component: UserLayout,
});

function UserLayout() {
  const { auth } = Route.useRouteContext();
  const navigate = useNavigate();
  const popup = usePopup();

  useEffect(() => {
    if (!auth.user?.isAuthenticated)
      navigate({ to: "/login", search: { redirect: "/user" } });
  }, [auth.user?.isAuthenticated]);
  return (
    <div className="my-5">
      <div className="flex items-center gap-4 mb-2">
        <AlignLeft className="stroke-blue-900" />
        <div>
          <p className="text-sm">Nama:</p>
          <p className="text-lg">{auth.user?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-5">
        <AtSign className="stroke-blue-900" />
        <div>
          <p className="text-sm">Email:</p>
          <p className="text-lg">{auth.user?.email}</p>
        </div>
      </div>
      <button
        onClick={(e: React.FormEvent) => {
          e.preventDefault();
          if (auth.user && auth.user.authentication_token)
            popup.setPopup(<NewUser />);
          // auth.logout();
          // window.location.reload()
        }}
        className={`py-2 pr-10 pl-2 mb-2 bg-blue-300 hover:bg-blue-900 hover:text-blue-100 rounded text-gray-800 text-sm flex gap-4 items-center w-full max-w-64`}
      >
        <span className="p-2 bg-blue-100 rounded">
          <UserPlus className="size-4 stroke-blue-900" />
        </span>
        Buat Akun Baru
      </button>
      <button
        onClick={(e: React.FormEvent) => {
          e.preventDefault();
          auth.logout();
          window.location.reload();
        }}
        className={`py-2 pr-10 pl-2 bg-red-300 hover:bg-red-900 hover:text-blue-100 rounded text-gray-800 text-sm flex gap-4 items-center w-full max-w-64`}
      >
        <span className="p-2 bg-blue-100 rounded">
          <LogOut className="size-4 stroke-blue-900" />
        </span>
        Keluar
      </button>
    </div>
  );
}
