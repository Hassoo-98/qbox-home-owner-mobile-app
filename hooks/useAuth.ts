import { AuthContext } from "@/context"
import { useContext } from "react"

export const useAuth = () => {
    const { userToken, user, login, logout, isLoading } = useContext(AuthContext)

    return {
        userToken, user, login, logout, isLoading
    }
}