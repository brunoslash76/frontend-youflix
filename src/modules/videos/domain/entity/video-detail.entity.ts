import type { ModerationStatus } from "../types/moderation-status.type"
import type { ProcessingProgress } from "../types/processing-progress.type"
import type { VideoStatus } from "../types/video-status.type"
import type { VideoStoryboard } from "../types/video-storyboard.type"
import type { GenreEntity } from "./genre.entity"


export interface VideoDetailEntity {
  publicId: string
  title: string
  description: string
  status: VideoStatus
  isPublic: boolean
  genres: GenreEntity[]
  watchUrl: string
  thumbnailUrl: string | null
  thumbnailOptions: string[]
  streamUrl: string | null
  durationSeconds: number | null
  processing: ProcessingProgress
  storyboard: VideoStoryboard | null
  moderation: { status: ModerationStatus; reason: string | null } | null
  author: {
    id: string
    firstName: string
    lastName: string
  }
}
