import { Outlet } from "react-router"
import { MainHeaderComponent } from "../components/organisms/main-header.component"
import { MainMenuAsideComponent } from "../components/organisms/main-menu-aside.component"

export const MainLayoutTemplate = () => {
  return (
    <div className="">
      <MainHeaderComponent />
      <MainMenuAsideComponent />
      <main className="min-h-dvh pt-22 pl-68">
        <Outlet />
      </main>
    </div>
  )
}