import type { VideoStoryboard } from '../../../domain/types/video-storyboard.type'
import { formatTime } from '../../utils/format-time.util'
import { storyboardTileAt } from '../../utils/storyboard-tile-at.util'

interface Props {
  storyboard: VideoStoryboard | null
  time: number
  left: number
}

export const StoryboardPreview = ({ storyboard, time, left }: Props) => {
  const tile = storyboard ? storyboardTileAt(storyboard, time) : null
  
  return (
    <div className="pointer-events-none absolute bottom-full mb-3 flex -translate-x-1/2 flex-col items-center gap-1" style={{ left }}>
      {tile && (
        <div
          className="rounded-md border-2 border-white bg-black shadow-lg"
          style={{
            width: tile.width,
            height: tile.height,
            backgroundImage: `url(${tile.url})`,
            backgroundPosition: `-${tile.x}px -${tile.y}px`,
          }}
        />
      )}
      <span className="rounded bg-black/80 px-2 py-0.5 text-xs font-medium tabular-nums text-white">{formatTime(time)}</span>
    </div>
  )
}
