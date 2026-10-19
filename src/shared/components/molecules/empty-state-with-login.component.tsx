import { VideoIcon } from "lucide-react"
import { UserButton } from "./user-button.component"

export const EmptyStateWithLoginComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full mx-auto pt-20">
      <VideoIcon className="w-20 h-20" />
      <h2 className="text-2xl font-bold mb-2">Enjoy your favorite videos</h2>
      <p className="text-sm text-primary mb-12">Sign in to access videos that you've liked or saved</p>
      <UserButton />
    </div>
  )
}