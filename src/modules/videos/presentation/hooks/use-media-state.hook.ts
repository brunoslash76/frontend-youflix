import { useEffect, useState, type RefObject } from "react";
import type { Direction } from "../../domain/types/direction.type";
import type { MediaState } from "../../domain/types/media-state.type";
import { loadPlayerPreferences, savePlayerPreference } from "../utils/player-preferences.util";

const INITIAL_STATE: MediaState = {
  paused: true,
  ended: false,
  waiting: false,
  currentTime: 0,
  duration: 0,
  bufferedEnd: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,
}
const MEDIA_EVENTS = Object.freeze([
  'play',
  'pause',
  'timeupdate',
  'durationchange',
  'progress',
  'volumechange',
  'ratechange',
  'ended',
  'loadedmetadata',
  'seeking'
])

const READY_EVENTS = Object.freeze([
  'playing',
  'canplay',
  'seeked'
])

const FRAME_SECONDS = 1 / 30

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const bufferedEndAt = (video: HTMLVideoElement) => {
  const { buffered, currentTime } = video

  for (let i = 0; i < buffered.length; i++) {
    if (
      buffered.start(i) <= currentTime + 0.5
      && currentTime <= buffered.end(i)
    ) {
      return buffered.end(i)
    }
  }
  return currentTime
}

export const useMediaState = (videoRef: RefObject<HTMLVideoElement | null>, fallbackDuration: number) => {
  const [state, setState] = useState<MediaState>(INITIAL_STATE)

  //TODO: Adicionar JS DOCS para todas as funções

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const preferences = loadPlayerPreferences()
    video.volume = preferences.volume
    video.muted = preferences.muted

    let waiting = false
    const sync = () => setState({
      paused: video.paused,
      ended: video.ended,
      waiting,
      currentTime: video.currentTime,
      duration: Number.isFinite(video.duration) ? video.duration : 0,
      bufferedEnd: bufferedEndAt(video),
      volume: video.volume,
      muted: video.muted,
      playbackRate: video.playbackRate,
    })

    const onWaiting = () => {
      waiting = true
      sync()
    }

    const onReady = () => {
      waiting = false
      sync()
    }

    MEDIA_EVENTS.forEach(name => video.addEventListener(name, sync))
    READY_EVENTS.forEach(name => video.addEventListener(name, onReady))

    video.addEventListener('waiting', onWaiting)

    return () => {
      MEDIA_EVENTS.forEach(name => video.removeEventListener(name, sync))
      READY_EVENTS.forEach(name => video.removeEventListener(name, onReady))
    }
  }, [videoRef])

  const duration = state.duration || fallbackDuration

  const withVideo = (fn: (video: HTMLVideoElement) => void) => {
    const video = videoRef.current

    if (video) fn(video)
  }

  const seek = (seconds: number) => withVideo(video => {
    video.currentTime = clamp(seconds, 0, duration)
  })

  const togglePlay = () => withVideo(video => {
    if (video.paused || video.ended) video.play().catch(() => undefined)
    else video.pause()
  })

  const setVolume = (value: number) => withVideo(video => {
    const next = clamp(value, 0, 1)
    video.volume = next
    video.muted = next === 0
    savePlayerPreference('volume', next)
    savePlayerPreference('muted', video.muted)
  })

  const toggleMute = () => withVideo(video => {
    video.muted = !video.muted
    if (!video.muted && video.volume === 0) video.volume = 0.5
    savePlayerPreference('muted', video.muted)
    savePlayerPreference('volume', video.volume)
  })

  const setPlaybackRate = (rate: number) => withVideo(video => {
    video.playbackRate = rate
  })

  const seekBy = (delta: number) => withVideo(video => seek(video.currentTime + delta))

  const stepFrame = (direction: Direction) => withVideo(video => {
    if (video.paused) seek(video.currentTime + direction * FRAME_SECONDS)
  })

  return {
    ...state,
    duration,
    seek,
    seekBy, togglePlay,
    setVolume,
    toggleMute,
    setPlaybackRate,
    stepFrame,
  }
}
