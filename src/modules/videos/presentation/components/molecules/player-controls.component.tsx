import { Maximize, Minimize, Pause, Play, RectangleHorizontal, RotateCcw, Settings } from "lucide-react"
import { formatTime } from "../../utils/format-time.util"
import { PlayerIconButton } from "../atoms/player-icon-button.component"
import { PlayerVolume } from "./player-volume.component"

interface Props {
  paused: boolean
  ended: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  isFullscreen: boolean
  theater: boolean
  settingsOpen: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
  onVolumeChange: (volume: number) => void
  onToggleSettings: () => void
  onToggleTheater: () => void
  onToggleFullscreen: () => void
}

export const PlayerControls = ({
  paused,
  ended,
  currentTime,
  duration,
  volume,
  muted,
  isFullscreen,
  theater,
  settingsOpen,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleSettings,
  onToggleTheater,
  onToggleFullscreen
}: Props) => {
  const playLabel = ended ? 'Assistir novamente' : paused ? 'Reproduzir (k)' : 'Pausar (k)'

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <PlayerIconButton label={playLabel} onClick={onTogglePlay}>
          {ended
            ? <RotateCcw size={22} />
            : paused
              ? <Play size={24} fill="currentColor" />
              : <Pause size={24} fill="currentColor" />}
        </PlayerIconButton>
        <PlayerVolume volume={volume} muted={muted} onToggleMute={onToggleMute} onChange={onVolumeChange} />
        <span className="ml-2 text-sm tabular-nums text-white">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <PlayerIconButton label="Configurações" aria-haspopup="menu" aria-expanded={settingsOpen} onClick={onToggleSettings}>
          <Settings size={22} className={`transition-transform duration-200 ${settingsOpen ? 'rotate-45' : ''}`} />
        </PlayerIconButton>
        {!isFullscreen && (
          <PlayerIconButton label={theater ? 'Modo padrão (t)' : 'Modo cinema (t)'} onClick={onToggleTheater}>
            <RectangleHorizontal size={22} />
          </PlayerIconButton>
        )}
        <PlayerIconButton label={isFullscreen ? 'Sair da tela cheia (f)' : 'Tela cheia (f)'} onClick={onToggleFullscreen}>
          {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
        </PlayerIconButton>
      </div>
    </div>
  )
}
