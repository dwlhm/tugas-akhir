import { AxiosError } from "axios";
import { QueryClient, UseQueryOptions, UseMutationOptions, DefaultOptions } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
    queries: {
        refetchOnWindowFocus: false,
        retry: false,
    }
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

export type ExtartctFnReturnType<FnType extends (...args: any) => any> = Awaited<ReturnType<FnType>>

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
    UseQueryOptions<ExtartctFnReturnType<QueryFnType>>,
    'queryKey' | 'queryFn'
>

export type MutattionConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
    ExtartctFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
>