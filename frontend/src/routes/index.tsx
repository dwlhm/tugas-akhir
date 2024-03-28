import { Overview } from "@/features/overview"
import { useRoutes } from "react-router-dom"

export const AppRouter = () => {
    const commonRoute = [{
        path: "/",
        element: <Overview />
    }]

    const element = useRoutes([...commonRoute])

    return <>{element}</>
}