import type { PlayerLevel } from "@/modules/videos/domain/types/player.level.type"
import { useState } from "react"
import { PLAYBACK_RATES } from "../../utils/playback-rate.util"
import { MenuHeader } from "../atoms/player-settings-menu-header.component"
import { MenuOption } from "../atoms/player-settings-menu-options.component"
import { MenuRow } from "../atoms/player-settings-menu-row.component"

type Panel = 'main' | 'quality' | 'speed'

interface Props {
  levels: PlayerLevel[]
  selectedLevel: number
  activeLevel: number
  playbackRate: number
  onSelectLevel: (index: number) => void
  onSelectRate: (rate: number) => void
  onClose: () => void
}

const rateLabel = (rate: number) => (rate === 1 ? 'Normal' : `${rate}x`)

export const PlayerSettingsMenu = ({
  levels,
  selectedLevel,
  activeLevel,
  playbackRate,
  onSelectLevel,
  onSelectRate,
  onClose
}: Props) => {
  const [panel, setPanel] = useState<Panel>('main')

  const heightOf = (index: number) => levels.find(level => level.index === index)?.height
  const activeHeight = heightOf(activeLevel)
  const autoLabel = activeHeight ? `Auto (${activeHeight}p)` : 'Auto'
  const qualityLabel = selectedLevel === -1 ? autoLabel : `${heightOf(selectedLevel)}p`
  const sortedLevels = [...levels].sort((a, b) => b.height - a.height)

  const pick = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <div
      role="menu"
      aria-label="Configurações do player"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
      className="absolute bottom-16 right-3 z-20 max-h-[70%] min-w-64 overflow-y-auto rounded-xl bg-black/90 py-2 text-sm text-white shadow-xl backdrop-blur"
    >
      {panel === 'main' && (
        <>
          {levels.length > 0 && <MenuRow label="Qualidade" value={qualityLabel} onClick={() => setPanel('quality')} />}
          <MenuRow label="Velocidade" value={rateLabel(playbackRate)} onClick={() => setPanel('speed')} />
        </>
      )}
      {panel === 'quality' && (
        <>
          <MenuHeader title="Qualidade" onBack={() => setPanel('main')} />
          {sortedLevels.map(level => (
            <MenuOption
              key={level.index}
              label={`${level.height}p`}
              checked={selectedLevel === level.index}
              onClick={() => pick(() => onSelectLevel(level.index))}
            />
          ))}
          <MenuOption label={autoLabel} checked={selectedLevel === -1} onClick={() => pick(() => onSelectLevel(-1))} />
        </>
      )}
      {panel === 'speed' && (
        <>
          <MenuHeader title="Velocidade" onBack={() => setPanel('main')} />
          {PLAYBACK_RATES.map(rate => (
            <MenuOption key={rate} label={rateLabel(rate)} checked={playbackRate === rate} onClick={() => pick(() => onSelectRate(rate))} />
          ))}
        </>
      )}
    </div>
  )
}