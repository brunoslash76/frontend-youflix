import { useEffect, useState, type RefObject } from "react"

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

export const useFullscreen = (
  containerRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(
      document.fullscreenElement !== null
      && document.fullscreenElement === containerRef.current
    )

    document.addEventListener('fullscreenchange', onChange)

    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [containerRef])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      return
    }

    const container = containerRef.current

    if (container?.requestFullscreen) {
      container.requestFullscreen().catch(() => undefined)
      return
    }

    (videoRef.current as WebkitVideo | null)?.webkitEnterFullscreen?.()
  }

  return {
    isFullscreen,
    toggleFullscreen,
  }
}