import type { VideoStatus } from "../types/video-status.type"

export interface CompleteUploadResponseDto {
  publicId: string
  status: VideoStatus
}
