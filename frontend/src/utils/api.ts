export interface API<T> {
    code: number,
    error?: string[],
    body?: T
}

export interface SuccessResponse {
    success: string
}