import { useAppSelector } from "@/shared/store"
import { useState } from "react"
import { useGetHomeFeedQuery } from "../../infra/api/video.api"
import { VideoListItemComponent } from "../components/molecules/video-list-item.component"
import { VideosPageEmptyStateComponent } from "../components/organisms/videos-page-empty-state.component"

export const VideosPage = () => {
  const status = useAppSelector(state => state.auth.status)
  const [page] = useState(1)
  const { data: videoFeed, isLoading } = useGetHomeFeedQuery(
    { status, page, limit: 20 },
    { skip: status === 'checking' },
  )

  if (status === 'checking' || isLoading) return <div>Loading...</div>
  if (!videoFeed?.items?.length) return <VideosPageEmptyStateComponent />
  return (
    <div className="bg-primary-ghost">
      <h1>{videoFeed?.personalized ? 'Recommended for you' : 'Latest videos'}</h1>
      <div>
        {videoFeed?.items.map(video => (
          <VideoListItemComponent key={video.publicId} video={video} />
        ))}
      </div>
    </div>
  )
}
