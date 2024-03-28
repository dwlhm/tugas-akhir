import * as React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter as Router } from "react-router-dom"
import { Button } from "../components/Elements"
import { queryClient } from "../lib/react-query"

const ErrorFallback = () => {
    return(
        <div>
            <h2>Oooops, something went wrong :(</h2>
            <Button onClick={() => window.location.assign(window.location.origin)}>
                Refresh
            </Button>
        </div>
    )
}

type AppProviderProps = {
    children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    return(
        <React.Suspense
            fallback={
                <div>
                    Loading...
                </div>
            }
        >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <QueryClientProvider client={queryClient}>
                    <ReactQueryDevtools />
                    <Router>
                        {children}
                    </Router>
                </QueryClientProvider>
            </ErrorBoundary>
        </React.Suspense>
    )
}