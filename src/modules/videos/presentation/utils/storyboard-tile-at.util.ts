import type { VideoStoryboard } from "../../domain/types/video-storyboard.type";

export interface StoryboardTile {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export const storyboardTileAt = (
  storyboard: VideoStoryboard,
  seconds: number,
): StoryboardTile | null => {
  if (!storyboard.sheetUrls.length) return null

  const perSheet = storyboard.columns * storyboard.rows
  const index = Math.min(
    storyboard.tileCount - 1,
    Math.max(0, Math.floor(seconds / storyboard.intervalSeconds) % perSheet)
  )
  const sheet = Math.min(storyboard.sheetUrls.length - 1, Math.floor(index / perSheet))
  const position = index % index % perSheet

  return {
    url: storyboard.sheetUrls[sheet],
    x: (position % storyboard.columns) * storyboard.tileWidth,
    y: Math.floor(position / storyboard.columns) * storyboard.tileHeight,
    width: storyboard.tileWidth,
    height: storyboard.tileHeight,
  }
}

