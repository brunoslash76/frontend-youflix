import type { VideoListItem } from "@/modules/videos/domain/entity/video-list-item.entity"
import type { SyntheticEvent } from "react"
import { Link } from "react-router"
import { VideoCardMeta } from "./video-card-meta.component"

interface Props {
  video: VideoListItem
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
}

export const VideoThumbLandscapeComponent = ({ video, onLoad }: Props) => {
  return (
    <Link to={`/watch?v=${video.publicId}`} className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-background">
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt=""
            onLoad={onLoad}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <VideoCardMeta video={video} />
    </Link>
  )
}
