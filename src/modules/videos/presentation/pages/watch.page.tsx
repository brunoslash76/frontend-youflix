import { useGetVideoQuery } from "@/modules/videos/infra/api/video.api"
import { useState } from "react"
import { useSearchParams } from "react-router"
import { VideoPlayer } from "../components/organisms/video-player.component"
import { loadPlayerPreferences, savePlayerPreference } from "../utils/player-preferences.util"

const StatusMessage = ({ title, detail }: { title: string; detail?: string }) => (
  <section className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-16 text-center">
    <h1 className="text-xl font-semibold text-primary">{title}</h1>
    {detail && <p className="text-sm text-primary-light">{detail}</p>}
  </section>
)

export const WatchPage = () => {
  const [searchParams] = useSearchParams()
  const [processingDone, setProcessingDone] = useState(false)

  const publicId = searchParams.get('v')
  const [theater, setTheater] = useState(() => loadPlayerPreferences().theater)
  const { data: video, isError, isLoading } = useGetVideoQuery(publicId ?? '', {
    skip: !publicId,
    pollingInterval: processingDone ? 0 : 5000,
    skipPollingIfUnfocused: true,
  })

  if (!processingDone && (video?.processing.done || video?.status === 'failed')) setProcessingDone(true)

  const toggleTheater = () => {
    const next = !theater
    savePlayerPreference('theater', next)
    setTheater(next)
  }

  if (!publicId || isError) return <StatusMessage title="Vídeo não encontrado" />
  if (isLoading || !video) return <StatusMessage title="Carregando..." />
  if (video.status === 'failed') return <StatusMessage title="Falha ao processar o vídeo" />
  if (!video.streamUrl) {
    return <StatusMessage title="Processando vídeo..." detail={`${video.processing.percent}% concluído`} />
  }

  return (
    <div className="flex flex-col">
      <div className={theater ? 'w-full bg-black' : 'mx-auto w-full max-w-6xl px-4 pt-6'}>
        <div className={theater ? 'mx-auto max-w-[calc((100vh-8rem)*16/9)]' : ''}>
          <VideoPlayer
            key={video.publicId}
            src={video.streamUrl}
            poster={video.thumbnailUrl}
            storyboard={video.storyboard}
            durationSeconds={video.durationSeconds}
            theater={theater}
            onToggleTheater={toggleTheater}
          />
        </div>
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4">
        <h1 className="text-xl font-semibold text-primary">{video.title}</h1>
        <p className="text-sm text-primary-light">
          {video.author.firstName} {video.author.lastName}
        </p>
        {video.description && (
          <p className="whitespace-pre-line rounded-xl bg-white/5 p-3 text-sm text-primary">{video.description}</p>
        )}
      </section>
    </div>
  )
}