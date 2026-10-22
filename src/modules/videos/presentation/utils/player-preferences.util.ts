const KEYS = Object.freeze({
  volume: 'player-volume',
  muted: 'player-muted',
  bandwidth: 'player-bandwidth',
  theater: 'player-theater',
})

type PreferenceKey = keyof typeof KEYS

const readNumber = (key: PreferenceKey, fallback: number) => {
  const raw = localStorage.getItem(KEYS[key])
  const value = raw === null ? Number.NaN : Number(raw)
  return Number.isFinite(value) ? value : fallback
}

export const loadPlayerPreferences = () => ({
  volume: Math.min(1, Math.max(0, readNumber('volume', 1))),
  muted: localStorage.getItem(KEYS.muted) === 'true',
  bandwidth: readNumber('bandwidth', 1_000_000),
  theater: localStorage.getItem(KEYS.theater) === 'true',
})

export const savePlayerPreference = (key: PreferenceKey, value: number | boolean) => {
  localStorage.setItem(KEYS[key], String(value))
}
