import { Play } from 'lucide-react'
import { useRef, useState } from 'react'
import type { VideoStoryboard } from '../../../domain/types/video-storyboard.type'
import { useAutoHide } from '../../hooks/use-auto-hide.hook'
import { useFullscreen } from '../../hooks/use-fullscreen.hook'
import { useHlsPlayer } from '../../hooks/use-hls-player.hook'
import { useMediaState } from '../../hooks/use-media-state.hook'
import { usePlayerKeyboard } from '../../hooks/use-player-keyboard.hook'
import { nextPlaybackRate } from '../../utils/playback-rate.util'
import { PlayerBezel, type BezelIcon } from '../atoms/player-bezel.component'
import { PlayerSpinner } from '../atoms/player-spinner.component'
import { PlayerControls } from '../molecules/player-controls.component'
import { PlayerProgressBar } from '../molecules/player-progress-bar.component'
import { PlayerSettingsMenu } from '../molecules/player-settings-menu.component'

interface Props {
  src: string
  poster?: string | null
  storyboard: VideoStoryboard | null
  durationSeconds: number | null
  theater: boolean
  onToggleTheater: () => void
}

export const VideoPlayer = ({ src, poster, storyboard, durationSeconds, theater, onToggleTheater }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPointerType = useRef('mouse')
  const { videoRef, levels, selectedLevel, activeLevel, selectLevel, error, unsupported } = useHlsPlayer(src)
  const media = useMediaState(videoRef, durationSeconds ?? 0)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef, videoRef)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const [bezel, setBezel] = useState<{ id: number; icon: BezelIcon }>({ id: 0, icon: 'play' })
  const controls = useAutoHide(media.paused || settingsOpen || scrubbing)

  const togglePlay = () => {
    setBezel(current => ({ id: current.id + 1, icon: media.paused || media.ended ? 'play' : 'pause' }))
    media.togglePlay()
    controls.show()
  }

  usePlayerKeyboard({
    togglePlay,
    seekBy: media.seekBy,
    seekToFraction: (fraction) => media.seek(media.duration * fraction),
    changeVolume: (delta) => media.setVolume((media.muted ? 0 : media.volume) + delta),
    toggleMute: media.toggleMute,
    toggleFullscreen,
    toggleTheater: onToggleTheater,
    stepFrame: media.stepFrame,
    changeRate: (direction) => media.setPlaybackRate(nextPlaybackRate(media.playbackRate, direction)),
    onShortcut: controls.show,
  })

  const onSurfaceClick = () => {
    if (settingsOpen) {
      setSettingsOpen(false)
      return
    }
    if (lastPointerType.current !== 'mouse' && !controls.visible) {
      controls.show()
      return
    }
    togglePlay()
  }

  const rootClassName = [
    'group/player relative w-full overflow-hidden bg-black select-none',
    isFullscreen ? 'h-full' : 'aspect-video',
    !isFullscreen && !theater ? 'rounded-xl' : '',
    controls.visible ? '' : 'cursor-none',
  ].join(' ')

  const fade = controls.visible ? 'opacity-100' : 'pointer-events-none opacity-0'

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      onPointerDown={(event) => {
        lastPointerType.current = event.pointerType
      }}
      onPointerMove={(event) => {
        if (event.pointerType === 'mouse') controls.show()
      }}
      onPointerLeave={() => {
        if (!media.paused) controls.hide()
      }}
    >
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-contain"
      />

      <div className="absolute inset-0" onClick={onSurfaceClick} onDoubleClick={toggleFullscreen} />

      {media.waiting && !media.paused && <PlayerSpinner />}
      {bezel.id > 0 && <PlayerBezel key={bezel.id} icon={bezel.icon} />}

      {media.paused && media.currentTime === 0 && !error && (
        <button
          type="button"
          aria-label="Reproduzir"
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-player-accent"
        >
          <Play size={32} fill="currentColor" />
        </button>
      )}

      {(error || unsupported) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center text-white">
          {error ?? 'Seu navegador não suporta este formato de vídeo.'}
        </div>
      )}

      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 to-transparent transition-opacity duration-300 ${fade}`} />

      <div className={`absolute inset-x-0 bottom-0 px-3 pb-1 transition-opacity duration-300 ${fade}`}>
        <PlayerProgressBar
          currentTime={media.currentTime}
          duration={media.duration}
          bufferedEnd={media.bufferedEnd}
          storyboard={storyboard}
          onSeek={media.seek}
          onScrubChange={setScrubbing}
        />
        <PlayerControls
          paused={media.paused}
          ended={media.ended}
          currentTime={media.currentTime}
          duration={media.duration}
          volume={media.volume}
          muted={media.muted}
          isFullscreen={isFullscreen}
          theater={theater}
          settingsOpen={settingsOpen}
          onTogglePlay={togglePlay}
          onToggleMute={media.toggleMute}
          onVolumeChange={media.setVolume}
          onToggleSettings={() => setSettingsOpen(open => !open)}
          onToggleTheater={onToggleTheater}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>

      {settingsOpen && (
        <PlayerSettingsMenu
          levels={levels}
          selectedLevel={selectedLevel}
          activeLevel={activeLevel}
          playbackRate={media.playbackRate}
          onSelectLevel={selectLevel}
          onSelectRate={media.setPlaybackRate}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}