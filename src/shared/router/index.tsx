import { authRoutes } from "@/modules/auth/presentation/routes/auth.routes";
import { createBrowserRouter } from "react-router";
import { GuestRoute, ProtectedRoute } from "./guards";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      ...authRoutes
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [

    ]
  }
]) 