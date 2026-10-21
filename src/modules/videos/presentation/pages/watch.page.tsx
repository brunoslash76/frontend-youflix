import { useGetVideoQuery } from "@/modules/videos/infra/api/video.api"
import { useState } from "react"
import { useSearchParams } from "react-router"
import { VideoPlayer } from "../components/organisms/video-player.component"

export const WatchPage = () => {
  const [searchParams] = useSearchParams()
  const publicId = searchParams.get('v') as string
  const [stopPolling, setStopPolling] = useState(false)
  const { data: video, isError } = useGetVideoQuery(publicId ?? '', {
    skip: !publicId,
    pollingInterval: stopPolling ? 0 : 3000,
  })

  if (!stopPolling && (video?.streamUrl || video?.status === 'failed')) {
    setStopPolling(true)
  }

  if (isError) {
    return (
      <div>
        <h1>Video não encontrado</h1>
      </div>
    )
  }

  if (video?.status === 'failed') {
    return (
      <div>
        <h1>Falha ao carregar o video</h1>
      </div>
    )
  }

  if (!video?.streamUrl) {
    return (
      <div>
        <h1>Processando video...</h1>
      </div>
    )
  }

  console.log(video)
  return (
    <section className="max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-thin mb-2">Watch video</h1>
      {video && (
        <VideoPlayer src={video.streamUrl} poster={video.thumbnailUrl} />
      )}
    </section>
  )
}
