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
        <div className="bg-primary-ghost pr-6">
          <h1 className="mb-6 text-xl font-medium">
            {videoFeed.personalized ? 'Recommended for you' : 'Latest videos'}
          </h1>
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {videoFeed.items.map(video => (
              <VideoListItemComponent key={video.publicId} video={video} />
            ))}
          </div>
        </div>
      )}
      <ModalAfterRegisterDialogComponent open={open} close={close} />
    </>
  )
}
