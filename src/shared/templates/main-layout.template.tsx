import { Outlet } from "react-router"
import { MainHeaderComponent } from "../components/organisms/main-header.component"

export const MainLayoutTemplate = () => {
  return (
    <div className="">
      <MainHeaderComponent />
      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  )
}