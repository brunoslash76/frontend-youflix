import { authRoutes } from "@/modules/auth/presentation/routes/auth.routes";
import { videoRoutes } from "@/modules/videos/presentation/routes/video.routes";
import { createBrowserRouter } from "react-router";
import { MainLayoutTemplate } from "../templates/main-layout.template";
import { GuestRoute, ProtectedRoute } from "./guards";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      ...authRoutes,
      {
        element: <MainLayoutTemplate />,
        children: [
          ...videoRoutes,
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [

    ]
  }
]) 