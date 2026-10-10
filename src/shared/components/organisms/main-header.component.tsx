import { MainSearchInput } from "@/modules/search/presentation/components/molecules/main-search-input.component"
import { Logo } from "@/shared/assets/logo"
import { Link } from "react-router"

export const MainHeaderComponent = () => {
  return (
    <header className="bg-primary-ghost py-4">
      <nav className="container flex items-center justify-between">
        <div className="w-32 flex items-center h-fit justify-center ml-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <MainSearchInput onSearch={() => {}} />
      </nav>
    </header>
  )
}
