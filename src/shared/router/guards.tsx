import { useAppSelector } from "@/shared/store"
import { Navigate, Outlet, useLocation } from "react-router"

export const ProtectedRoute = () => {
  const { status } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // TODO: Add a loading component
  if (status === 'checking') return null
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

export const GuestRoute = () => {
  const { status } = useAppSelector((state) => state.auth)
  // TODO: Add a loading component
  if (status === 'checking') return null
  if (status === 'authenticated') return <Navigate to="/" replace />
  return <Outlet />
} 
