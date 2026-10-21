import { useHlsPlayer } from "../../hooks/use-hls-player.hook"


interface Props {
  src: string
  poster?: string | null
}

export const VideoPlayer = ({ src, poster }: Props) => {
  const { videoRef, levels, selectedLevel, selectLevel, unsupported, error } = useHlsPlayer(src)

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video w-full bg-black">
        <video
          ref={videoRef}
          poster={poster ?? undefined}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      </div>
      {(error || unsupported) && (
        <p className="text-danger">{error ?? 'Seu navegador não suporta este formato de vídeo.'}</p>
      )}
      {levels.length > 1 && (
        <select value={selectedLevel} onChange={(e) => selectLevel(Number(e.target.value))}>
          <option value={-1}>Auto</option>
          {levels.map((level) => (
            <option key={level.index} value={level.index}>{level.height}p</option>
          ))}
        </select>
      )}
    </div>
  )
}
