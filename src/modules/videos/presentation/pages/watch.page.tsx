import { useGetVideoQuery } from "@/modules/videos/infra/api/video.api"
import { useState } from "react"
import { useSearchParams } from "react-router"
import type { ModerationStatus } from "../../domain/types/moderation-status.type"
import { VideoPlayer } from "../components/organisms/video-player.component"
import { loadPlayerPreferences, savePlayerPreference } from "../utils/player-preferences.util"

const StatusMessage = ({ title, detail }: { title: string; detail?: string }) => (
  <section className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-16 text-center">
    <h1 className="text-xl font-semibold text-primary">{title}</h1>
    {detail && <p className="text-sm text-primary-light">{detail}</p>}
  </section>
)

const MODERATION_MESSAGES: Partial<Record<ModerationStatus, string>> = {
  pending: 'Seu vídeo está em análise e ainda não aparece para outras pessoas.',
  needs_review: 'Seu vídeo foi enviado para revisão manual e ainda não aparece para outras pessoas.',
  rejected: 'Seu vídeo foi removido por violar as diretrizes da comunidade.',
  quarantined: 'Seu vídeo foi bloqueado por violar as diretrizes da comunidade.',
}

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

  if (
    !processingDone 
    && (video?.processing.done || video?.status === 'failed')
    && video?.moderation?.status !== 'pending'
  ) setProcessingDone(true)

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

  if (video.moderation?.status === 'rejected' || video.moderation?.status === 'quarantined') {
    return <StatusMessage title="Vídeo indisponível" detail={MODERATION_MESSAGES[video.moderation.status]} />
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
      {video.moderation && MODERATION_MESSAGES[video.moderation.status] && (
        <div className="mx-auto mt-4 w-full max-w-6xl px-4">
          <p role="status" className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
            {MODERATION_MESSAGES[video.moderation.status]}
          </p>
        </div>
      )}
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