import { useAppSelector } from "@/shared/store"
import { useState } from "react"
import { useSearchParams } from "react-router"
import { useGetHomeFeedQuery } from "../../infra/api/video.api"
import { ModalAfterRegisterDialogComponent } from "../components/molecules/modal-after-register-dialog.component"
import { VideoListItemComponent } from "../components/molecules/video-list-item.component"
import { VideosPageEmptyStateComponent } from "../components/organisms/videos-page-empty-state.component"

export const VideosPage = () => {
  const status = useAppSelector(state => state.auth.status)
  const [searchParams, setSearchParams] = useSearchParams()
  const open =
    status === 'guest'
    && searchParams.get('notice') === 'activation-pending'
  const [page] = useState(1)
  const { data: videoFeed, isLoading } = useGetHomeFeedQuery(
    { status, page, limit: 20 },
    { skip: status === 'checking' },
  )

  const close = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('notice')
    setSearchParams(next, { replace: true })
  }

  if (status === 'checking' || isLoading) return <div>Loading...</div>

  return (
    <>
      {!videoFeed?.items?.length ? (
        <VideosPageEmptyStateComponent />
      ) : (
        <div className="bg-primary-ghost">
          <h1>{videoFeed?.personalized ? 'Recommended for you' : 'Latest videos'}</h1>
          <div>
            {videoFeed?.items.map(video => (
              <VideoListItemComponent key={video.publicId} video={video} />
            ))}
          </div>
        </div>
      )}
      <ModalAfterRegisterDialogComponent open={open} close={close} />
    </>
  )
}
