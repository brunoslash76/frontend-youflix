import type { VideoStoryboard } from "@/modules/videos/domain/types/video-storyboard.type"
import { useRef, useState, type PointerEvent } from "react"
import { formatTime } from "../../utils/format-time.util"
import { StoryboardPreview } from "./storyboard-preview.components"

interface Props {
  currentTime: number
  duration: number
  bufferedEnd: number
  storyboard: VideoStoryboard | null
  onSeek: (seconds: number) => void
  onScrubChange: (scribbing: boolean) => void
}

interface Point {
  x: number
  width: number
  time: number
}

const PREVIEW_HALF_WIDTH = 90

export const PlayerProgressBar = ({
  currentTime,
  duration,
  bufferedEnd,
  storyboard,
  onSeek,
  onScrubChange,
}: Props) => {
  const barRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Point | null>(null)
  const [scrubTime, setScrubTime] = useState<number | null>(null)

  const pointAt = (clientX: number): Point | null => {
    const bar = barRef.current

    if (!bar) return null

    const rect = bar.getBoundingClientRect()
    const x = Math.min(rect.width, Math.max(0, clientX - rect.left))
    return {
      x,
      width: rect.width,
      time: duration ? (x / rect.width) * duration : 0,
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    const point = pointAt(event.clientX)

    if (!point) return

    event.currentTarget.setPointerCapture(event.pointerId)

    setHover(point)
    setScrubTime(point.time)
    onScrubChange(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const point = pointAt(event.clientX)

    if (!point) return

    setHover(point)

    if (scrubTime !== null) setScrubTime(point.time)
  }

  const endScrub = () => {
    setScrubTime(null)
    onScrubChange(false)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (scrubTime === null) return

    onSeek(pointAt(event.clientX)?.time ?? scrubTime)
    endScrub()

    if (event.pointerType !== 'mouse') {
      setHover(null)
    }
  }

  const onPointerLeave = () => {
    if (scrubTime === null) {
      setHover(null)
    }
  }

  const shownTime = scrubTime ?? currentTime
  const percent = (value: number) => (duration ? `${Math.min(100, (value / duration) * 100)}%` : '0%')
  const previewLeft = hover
    ? Math.min(hover.width - PREVIEW_HALF_WIDTH, Math.max(PREVIEW_HALF_WIDTH, hover.x))
    : 0

  return (
    <div
      ref={barRef}
      role="slider"
      tabIndex={0}
      aria-label="Barra de progresso"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(shownTime)}
      aria-valuetext={`${formatTime(shownTime)} de ${formatTime(duration)}`}
      className="group/progress relative flex h-4 cursor-pointer touch-none items-center"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={endScrub}
      onPointerLeave={onPointerLeave}
    >
      <div className={`relative w-full bg-white/20 transition-[height] duration-150 ${scrubTime !== null ? 'h-1.25' : 'h-0.75 group-hover/progress:h-1.25'}`}>
        <div className="absolute inset-y-0 left-0 bg-white/40" style={{ width: percent(bufferedEnd) }} />
        {hover && <div className="absolute inset-y-0 left-0 bg-white/50" style={{ width: percent(hover.time) }} />}
        <div className="absolute inset-y-0 left-0 bg-player-accent" style={{ width: percent(shownTime) }} />
      </div>
      <div
        className={`absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-player-accent transition-transform duration-150 ${scrubTime !== null ? 'scale-100' : 'scale-0 group-hover/progress:scale-100'}`}
        style={{ left: percent(shownTime) }}
      />
      {hover && <StoryboardPreview storyboard={storyboard} time={hover.time} left={previewLeft} />}
    </div>
  )
}
