import type { VideoStatus } from "../types/video-status.type"
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
  author: {
    id: string
    firstName: string
    lastName: string
  }
}
