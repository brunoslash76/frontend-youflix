import type { VideoListItem } from "@/modules/videos/domain/entity/video-list-item.entity"
import { Link } from "react-router"
import { VideoCardMeta } from "./video-card-meta.component"

export const VideoThumbPortraitComponent = ({ video }: { video: VideoListItem }) => {
  return (
    <Link to={`/watch?v=${video.publicId}`} className="flex flex-col gap-3 self-start">
      <div className="relative mx-auto aspect-9/16 w-full max-w-56 overflow-hidden rounded-xl bg-background">
        {video.thumbnailUrl && (
          <img src={video.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <VideoCardMeta video={video} />
    </Link>
  )
}
