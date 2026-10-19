import type { VideoStatus } from "../types/video-status.type"

export interface CreateUploadResponseDto {
  publicId: string
  uploadUrl: string
  status: VideoStatus
  createdAt: string
  updatedAt: string
}
