import { useEffect, useRef, useState } from "react"
import type { VideoStatus } from "../../domain/types/video-status.type"
import { useCompleteUploadMutation, useCreateUploadMutation, useLazyGetVideoQuery } from "../../infra/api/video.api"
import { putToPresignedUrlStore } from "../../infra/storage/put-to-presigned-url.store"

const ALLOWED_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])
const POLL_INTERVAL_MS = 2000
const POLL_ATTEMPTS = 60

export type UploadPhase = 'idle' | 'creating' | 'uploading' | 'completing' | 'processing' | 'pending' | 'ready' | 'error'

interface UploadForm {
  title: string
  description: string
  genreIds: string[]
}

const validate = (file: File, form: UploadForm) => {
  if (!ALLOWED_TYPES.has(file.type)) return 'Use MP4, WEBM, or QuickTime (MOV).'
  if (form.title.trim().length < 7) return 'Title must be at least 7 characters long.'
  if (!form.description.trim()) return 'Description is required.'
  if (!form.genreIds.length) return 'Select at least one genre.'
  return null
}

const toErrorMessage = (error: unknown) => {
  const message = (error as { data?: { message?: string | string[] } })?.data?.message
  if (Array.isArray(message)) return message[0]
  if (typeof message === 'string') return message
  return error instanceof Error ? error.message : 'Upload failed'
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(signal.reason)
    }, { once: true })
  })

export const useVideoUpload = () => {
  const [createUpload] = useCreateUploadMutation()
  const [completeUpload] = useCompleteUploadMutation()
  const [getVideo] = useLazyGetVideoQuery()
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

  const start = async (file: File, form: UploadForm) => {
    const validationError = validate(file, form)

    setError(validationError)

    if (validationError) return

    abortRef.current?.abort()

    const controller = new AbortController()

    abortRef.current = controller
    
    const { signal } = controller

    try {
      setPhase('creating')
      const created = await createUpload({
        title: form.title.trim(),
        description: form.description.trim(),
        genreIds: form.genreIds,
        contentType: file.type,
        sizeBytes: file.size,
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

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS, signal)

        const video = await getVideo(created.publicId).unwrap()
        setStatus(video.status)

        if (video.status === 'ready') {
          setPhase('ready')
          return
        }

        if (video.status === 'failed') throw new Error('Processing failed. Try another file.')
      }
      setPhase('pending')
    } catch (err) {
      if (signal.aborted) return
      setPhase('error')
      setError(toErrorMessage(err))
    }
  }
  return { phase, progress, publicId, status, error, start, reset }
}