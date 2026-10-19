import { useAppSelector } from "@/shared/store"
import { UserIcon } from "lucide-react"
import { useNavigate } from "react-router"

export const UserButton = () => {
  const user = useAppSelector(state => state.auth.user)
  const navigate = useNavigate()

  const handleClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  return (
    <button 
      className="
      py-1
        px-2
        rounded-full
        hover:bg-background-secondary
        transition-colors
        cursor-pointer
        border
        border-info-light
        flex
        items-center
        gap-2
      "
      onClick={handleClick}
    >
      <p className="text-sm font-light text-info-light pointer-events-none">
        {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Sign in'}
      </p>
      <UserIcon className="pointer-events-none text-info-light w-4 h-4" />
    </button>
  )
}
