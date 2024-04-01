import { Overview } from "@/features/overview"
import { lazyImport } from "@/utils/lazyImport"
import { RouteObject, useRoutes } from "react-router-dom"

const { Device } = lazyImport(() => import('@/features/device'), 'Device')

export const AppRouter = () => {
    const commonRoute: RouteObject[] = [{
        path: "/",
        element: <Overview />,
        children: [
            { path: ":deviceId", element: <Device /> }
        ]
    }]

    const element = useRoutes([...commonRoute])

    return <>{element}</>
}