import type { VideoListItem } from "@/modules/videos/domain/entity/video-list-item.entity"
import { useState, type SyntheticEvent } from "react"
import { VideoThumbLandscapeComponent } from "../atoms/video-thumb-landscape.component"
import { VideoThumbPortraitComponent } from "../atoms/video-thumb-portrait.component"

export const VideoListItemComponent = ({ video }: { video: VideoListItem }) => {
  const [portrait, setPortrait] = useState(false)

  const onLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    setPortrait(naturalWidth < naturalHeight)
  }

  if (portrait) return <VideoThumbPortraitComponent video={video} />

  return <VideoThumbLandscapeComponent video={video} onLoad={onLoad} />
}
