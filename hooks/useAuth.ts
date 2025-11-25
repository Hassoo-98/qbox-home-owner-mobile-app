import { AuthContext } from "@/context"
import { useContext } from "react"

export const useAuth=()=>{
    const {userToken, login, logout, isLoading}=useContext(AuthContext)

    return{
        userToken, login, logout, isLoading
    }
}