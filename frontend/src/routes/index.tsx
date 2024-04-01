import { Overview } from "@/features/overview"
import { lazyImport } from "@/utils/lazyImport"
import { lazy } from "react"
import { RouteObject, useRoutes } from "react-router-dom"
import { Device } from "@/features/device"

// const { Device } = lazyImport(() => import('@/features/device'), 'Device')

export const AppRouter = () => {
    const commonRoute: RouteObject[] = [{
        path: "/",
        element: <Overview />,
        children: [
            { 
                path: ":deviceId",
                element: <Device />
            }
        ]
    }]

    const element = useRoutes([...commonRoute])

    return <>{element}</>
}