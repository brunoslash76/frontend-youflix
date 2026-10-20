import { useEffect, useRef, useState } from "react"
import type { VideoStatus } from "../../domain/types/video-status.type"
import { useCompleteUploadMutation, useCreateUploadMutation } from "../../infra/api/video.api"
import { putToPresignedUrlStore } from "../../infra/storage/put-to-presigned-url.store"

const ALLOWED_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

export type UploadPhase = 'idle' | 'creating' | 'uploading' | 'completing' | 'processing' | 'pending' | 'ready' | 'error'

const validate = (file: File) => {
  if (!ALLOWED_TYPES.has(file.type)) return 'Use MP4, WEBM, or QuickTime (MOV).'
  return null
}

const toErrorMessage = (error: unknown) => {
  const message = (error as { data?: { message?: string | string[] } })?.data?.message
  if (Array.isArray(message)) return message[0]
  if (typeof message === 'string') return message
  return error instanceof Error ? error.message : 'Upload failed'
}

export const useVideoUpload = () => {
  const [createUpload] = useCreateUploadMutation()
  const [completeUpload] = useCompleteUploadMutation()
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [progress, setProgress] = useState(0)
  const [publicId, setPublicId] = useState<string | null>(null)
  const [status, setStatus] = useState<VideoStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const reset = () => {
    abortRef.current?.abort()
    setPhase('idle')
    setProgress(0)
    setPublicId(null)
    setStatus(null)
    setError(null)
  }

  const start = async (file: File) => {
    const validationError = validate(file)

    setError(validationError)

    if (validationError) return

    abortRef.current?.abort()

    const controller = new AbortController()

    abortRef.current = controller
    
    const { signal } = controller

    try {
      setPhase('creating')
      const created = await createUpload({
        contentType: file.type,
        sizeBytes: file.size,
        filename: file.name,
      }).unwrap()

      signal.throwIfAborted()

      setPublicId(created.publicId)
      setStatus(created.status)
      setPhase('uploading')
      setProgress(0)
      await putToPresignedUrlStore(created.uploadUrl, file, { onProgress: setProgress, signal })

      setPhase('completing')
      const completed = await completeUpload(created.publicId).unwrap()

      signal.throwIfAborted()
      setStatus(completed.status)
      setPhase('processing')
    } catch (err) {
      if (signal.aborted) return
      setPhase('error')
      setError(toErrorMessage(err))
    }
  }
  return { phase, progress, publicId, status, error, start, reset, toErrorMessage }
}