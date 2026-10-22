import { Volume1, Volume2, VolumeX } from "lucide-react"
import { PlayerIconButton } from "../atoms/player-icon-button.component"

interface Props {
  volume: number
  muted: boolean
  onToggleMute: () => void
  onChange: (volume: number) => void
}

export const PlayerVolume = ({
  volume,
  muted,
  onToggleMute,
  onChange
}: Props) => {
  const level = muted ? 0 : volume

  return (
    <div className="group/volume flex items-center">
      <PlayerIconButton label={level === 0 ? 'Ativar som (m)' : 'Desativar som (m)'} onClick={onToggleMute}>
        {level === 0 ? <VolumeX size={22} /> : level < 0.5 ? <Volume1 size={22} /> : <Volume2 size={22} />}
      </PlayerIconButton>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={level}
        aria-label="Volume"
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-0 cursor-pointer accent-white opacity-0 transition-all duration-200 group-hover/volume:ml-1 group-hover/volume:w-20 group-hover/volume:opacity-100 focus-visible:ml-1 focus-visible:w-20 focus-visible:opacity-100"
      />
    </div>
  )
}
