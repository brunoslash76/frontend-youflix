import type { Direction } from "../../domain/types/direction.type"

export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export const nextPlaybackRate = (current: number, direction: Direction) => {
  const index = PLAYBACK_RATES.indexOf(current)

  const base = index === -1 ? PLAYBACK_RATES.indexOf(1) : index

  return PLAYBACK_RATES[Math.min(PLAYBACK_RATES.length - 1, Math.max(0, base + direction))]
}
