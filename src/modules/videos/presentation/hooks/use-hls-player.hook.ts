import Hls from 'hls.js'
import { useEffect, useRef, useState } from 'react'
import type { PlayerLevel } from '../../domain/types/player.level.type'
import { loadPlayerPreferences, savePlayerPreference } from '../utils/player-preferences.util'

const canPlayNativeHls = () => document.createElement('video').canPlayType('application/vnd.apple.mpegurl') !== ''

export const useHlsPlayer = (src: string | null) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [levels, setLevels] = useState<PlayerLevel[]>([])
  const [selectedLevel, setSelectedLevel] = useState(-1)
  const [activeLevel, setActiveLevel] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const unsupported = !Hls.isSupported() && !canPlayNativeHls()

  useEffect(() => {
    const video = videoRef.current

    if (!video || !src) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        startLevel: -1,
        abrEwmaDefaultEstimate: loadPlayerPreferences().bandwidth,
        maxBufferLength: 30,
        maxMaxBufferLength: 120,
        backBufferLength: 30,
      })

      hlsRef.current = hls

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setLevels(data.levels.map((level, index) => ({ index, height: level.height })))
      })

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => setActiveLevel(data.level))

      hls.on(Hls.Events.FRAG_LOADED, () => {
        if (hls.bandwidthEstimate > 0) savePlayerPreference('bandwidth', Math.round(hls.bandwidthEstimate))
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
        else {
          setError('Não foi possível reproduzir este vídeo')
          hls.destroy()
        }
      })

      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    }

    if (canPlayNativeHls()) {
      video.src = src

      return () => {
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [src])

  const selectLevel = (index: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = index

    setSelectedLevel(index)
  }

  return {
    videoRef,
    levels,
    selectedLevel,
    activeLevel,
    selectLevel,
    error,
    unsupported,
  }
}