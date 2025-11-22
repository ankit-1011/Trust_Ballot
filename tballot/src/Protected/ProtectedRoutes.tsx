import { useAuth } from "@/lib/AuthProvider"
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom"

interface ProtectedRoutesProps {
  children: ReactNode;
}


const ProtectedRoutes = ({children}:ProtectedRoutesProps) => {
     const {user}=useAuth()

  return user ? children : <Navigate to='/login'/>
}

export default ProtectedRoutes