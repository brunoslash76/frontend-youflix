import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import type { VideoListItem } from "../../../domain/entity/video-list-item.entity"

export const VideoListItemComponent = ({ video }: { video: VideoListItem }) => {
  const [portrait, setPortrait] = useState(false)
  return (
    <div key={video.publicId} className="flex flex-col gap-2">

      <img
        src={video.thumbnailUrl}
        alt={video.title}
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.target as HTMLImageElement
          setPortrait(naturalWidth < naturalHeight)
        }}
        className={
          portrait
            ? "absolute top-1/2 left-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2"
            : "h-full w-full object-cover"
        }
      />
      <div>
        <h2>{video.title}</h2>
        <p>{video.genres.map(genre => genre.name).join(', ')}</p>
        <p>{video.views}</p>
        <p>{formatDistanceToNow(video.createdAt)}</p>
      </div>
    </div>
  )
}
