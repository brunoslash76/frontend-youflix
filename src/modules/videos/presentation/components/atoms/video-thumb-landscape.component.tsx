import type { VideoListItem } from "@/modules/videos/domain/entity/video-list-item.entity";
import { formatDistanceToNow } from "date-fns";

interface Props {
  video: VideoListItem;
}

export const VideoThumbLandscapeComponent = ({ video }: Props) => {
  return (
    <div>
      <img src={video.thumbnailUrl} alt={video.title} className="w-30 object-cover" />
      <div>
        <p>{video.genres.map(genre => genre.name).join(', ')}</p>
        <p>{video.views}</p>
        <p>{formatDistanceToNow(video.createdAt)}</p>
      </div>
    </div>
  )
}