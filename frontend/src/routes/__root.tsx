import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AuthContextInterface } from "../auth/context";

interface MyRouteContext {
    auth: AuthContextInterface
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
    component: () => (
        <>
            <Outlet />
        </>
    )
})