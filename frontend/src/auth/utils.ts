import { User } from "./context"

const key = "monitoring.udara.key"

export function getStoredContext(): User {
    const data = localStorage.getItem(key)
    if (!data) return {
        isAuthenticated: false
    } as User
    const parsed_data: User = JSON.parse(data)
    return parsed_data
}