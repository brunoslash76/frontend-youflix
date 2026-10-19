import { currentUserSelector } from "@/modules/auth/infra/selectors/current-user.selector"
import { UserButton } from "@/shared/components/molecules/user-button.component"
import { useAppSelector } from "@/shared/store"
import { PlusIcon, VideoIcon } from "lucide-react"
import { Link } from "react-router"

export const VideosPageEmptyStateComponent = () => {
  const user = useAppSelector(currentUserSelector)
  return (
    <div className="flex flex-col items-center justify-center h-full mt-20">
      <VideoIcon className="w-20 h-20 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">No one has posted a video yet.</h2>
      <p className="text-sm text-primary mb-8">Be the first to post a video and start sharing your content with the world.</p>
      {user ? (
        <Link
          to="/upload"
          className="
            text-sm
            text-primary
            flex
            items-center
            gap-2
            border
            border-primary
            rounded-full
            px-4
            py-2
            w-full
            max-w-fit
          "
        >
          <PlusIcon />
          Post a video
        </Link>

      ) : (
        <UserButton />
      )}
    </div>
  )
}
