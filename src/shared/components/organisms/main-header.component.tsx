import { MainSearchInput } from "@/modules/search/presentation/components/molecules/main-search-input.component"
import { Logo } from "@/shared/assets/logo"
import { UserButton } from "@/shared/components/molecules/user-button.component"
import { useState } from "react"
import { Link } from "react-router"

export const MainHeaderComponent = () => {
  const [search, setSearch] = useState('')
  console.log(search)
  return (
    <header className="bg-primary-ghost py-4 px-8 z-10 fixed top-0 left-0 w-full">
      <nav className="flex items-center w-full justify-between ">
        <Link to="/" className="w-32 flex items-center h-fit justify-center">
          <Logo />
        </Link>
        <MainSearchInput onSearch={(term) => setSearch(term)} />
        <UserButton />
      </nav>
    </header>
  )
}
