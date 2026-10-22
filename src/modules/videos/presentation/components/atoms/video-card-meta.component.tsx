import type { VideoListItem } from "@/modules/videos/domain/entity/video-list-item.entity"
import { formatDistanceToNow } from "date-fns"

const viewsLabel = (views: number) => `${views} ${views === 1 ? 'view' : 'views'}`

export const VideoCardMeta = ({ video }: { video: VideoListItem }) => (
  <div className="flex flex-col gap-1 pr-2">
    <h2 className="line-clamp-2 text-base font-medium leading-snug">{video.title}</h2>
    <p className="text-sm text-primary-light">{video.author.username}</p>
    <p className="text-sm text-primary-light">
      {viewsLabel(video.views)} · {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
    </p>
  </div>
)
