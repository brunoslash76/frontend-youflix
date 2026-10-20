import { useMemo, useState, type SubmitEvent } from "react"
import { Link } from "react-router"

import { Button } from "@/shared/components/atoms/button.component"
import { Input } from "@/shared/components/atoms/input.component"
import { FileDropOverlay } from "@/shared/components/organisms/file-drop-overlay.component"
import { useWindowFileDrop } from "@/shared/hooks/use-window-file-drop.hook"
import { useCreateThumbnailUploadMutation, useGetGenresQuery, useUpdateVideoDetailsMutation } from "../../infra/api/video.api"
import { putToPresignedUrlStore } from "../../infra/storage/put-to-presigned-url.store"
import { ThumbnailPicker } from "../components/organisms/thumbnail-picker.component"
import { notify } from "../hooks/snackbar.store"
import { useVideoUpload } from "../hooks/user-video-upload.hook"

const titleFromFile = (file: File) => file.name.replace(/\.[^.]+$/, '').slice(0, 255)

export type ThumbnailChoice =
  | { source: 'suggested'; index: number }
  | { source: 'custom', blob: Blob, previewUrl: string }

export const UploadPage = () => {
  const { data: genres = [], isLoading: genresLoading } = useGetGenresQuery()
  const { phase, publicId, progress, status, error, start, reset, toErrorMessage } = useVideoUpload()
  const [choice, setChoice] = useState<ThumbnailChoice | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genreIds, setGenreIds] = useState<string[]>([])
  const onFileChange = (next: File | null) => {
    setFile(next)
    if (!next) return
    if (!title.trim()) {
      setTitle(titleFromFile(next))
    }
    void start(next)
  }
  const [createThumbnailUpload] = useCreateThumbnailUploadMutation()
  const [updateVideoDetails, { isLoading: saving }] = useUpdateVideoDetailsMutation()
  const busy = phase === 'creating' || phase === 'uploading' || phase === 'completing'
  const { dragging } = useWindowFileDrop({ onDrop: onFileChange, disabled: busy })
  const [fieldErrors, setFieldErrors] = useState<{ title?: string, description?: string, genres?: string }>({})

  const validateDetails = () => {
    const next: typeof fieldErrors = {}
    if (title.trim().length < 7) next.title = 'Title must be at least 7 characters.'
    if (!description.trim()) next.description = 'Add a description.'
    if (!genreIds.length) next.genres = 'Select at least one genre.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const phaseLabel = useMemo(() => {
    switch (phase) {
      case 'creating':
        return 'Creating upload...'
      case 'uploading':
        return `Uploading... ${progress}%`
      case 'completing':
        return 'Confirming upload...'
      case 'processing':
        return `Processing... (${status ?? 'queued'})`
      case 'ready':
        return 'Processing done — save to publish.'
      case 'error':
        return error ?? 'Something went wrong'
      case 'pending':
        return 'Still processing — it will appear in the feed when ready.'
      default:
        return error ?? 'Select a video and fill in the details'
    }
  }, [phase, progress, status, error])

  const toggleGenre = (id: string) => {
    setGenreIds(current => current.includes(id) ? current.filter(g => g !== id) : [...current, id])
  }

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateDetails()) return
    if (!publicId) return
    if (!file || busy) return

    try {


      let thumbnail: { thumbnailIndex?: number; customThumbnailKey?: string } | undefined;

      if (choice?.source === 'custom') {
        const { key, uploadUrl } = await createThumbnailUpload({
          publicId,
          contentType: choice.blob.type,
          sizeBytes: choice.blob.size,
        }).unwrap()

        await putToPresignedUrlStore(uploadUrl, choice.blob, {
          onProgress: () => { },
        })

        thumbnail = { customThumbnailKey: key }
      } else if (choice?.source === 'suggested') {
        thumbnail = { thumbnailIndex: choice.index }
      }
      await updateVideoDetails({
        publicId,
        title,
        description,
        genreIds,
        ...thumbnail,
      }).unwrap()
      notify('Video details saved')
    } catch (error) {
      console.error(error)
      notify(toErrorMessage(error))
    }
  }

  return (
    <section
      className="max-w-2xl mx-auto py-8 px-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <FileDropOverlay open={dragging} />
      <h1 className="text-3xl font-thin mb-2">Upload video</h1>
      <p className="text-sm text-primary mb-8">
        Details first, then the file goes straight to storage (YouTube-style direct upload).
        It becomes public when processing finishes.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label
          className={`
            border
            border-dashed
            border-primary-light
            rounded-md
            p-8
            text-center
            cursor-pointer
            hover:bg-primary-ghost
            ${dragging ? 'bg-primary-ghost border-primary-light' : 'border-primary-light'}
          `}
        >
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            disabled={busy}
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
          {file ? (
            <span>
              {file.name} ({Math.round(file.size / (1024 * 1024))} MB)
            </span>
          ) : (
            <span>Drag & drop or click to choose a video</span>
          )}
        </label>
        <Input
          label="Title"
          value={title}
          minLength={7}
          maxLength={255}
          disabled={busy}
          onChange={(event) => {
            setTitle(event.target.value)
            setFieldErrors(prev => ({ ...prev, title: undefined }))
          }}
          placeholder="Add a title that describes your video"
        />
        {fieldErrors.title && <p className="text-sm text-danger">{fieldErrors.title}</p>}
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            maxLength={5000}
            disabled={busy}
            rows={5}
            className="w-full p-2 rounded-xs border border-gray-300 font-light"
            onChange={(event) => {
              setDescription(event.target.value)
              setFieldErrors(prev => ({ ...prev, description: undefined }))
            }}
            placeholder="Tell viewers about your video"
          />
          {fieldErrors.description && <p className="text-sm text-danger">{fieldErrors.description}</p>}

        </div>
        <fieldset disabled={busy || genresLoading}>
          <legend className="mb-2">Genres</legend>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const selected = genreIds.includes(genre.id)
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => {
                    toggleGenre(genre.id)
                    setFieldErrors(prev => ({ ...prev, genres: undefined }))
                  }}
                  className={`px-3 py-1 rounded-md border text-sm ${selected ? 'bg-info-light text-black' : 'border-primary-light'
                    }`}
                >
                  {genre.name}
                </button>
              )
            })}
          </div>
          {fieldErrors.genres && <p className="text-sm text-danger">{fieldErrors.genres}</p>}
        </fieldset>
        {(phase === 'uploading' || phase === 'processing') && (
          <div className="w-full h-2 bg-primary-ghost rounded overflow-hidden">
            <div
              className="h-full bg-info-light transition-all"
              style={{ width: `${phase === 'uploading' ? progress : 100}%` }}
            />
          </div>
        )}
        <p className="text-sm">{phaseLabel}</p>
        {publicId && file && (
          <>
            <ThumbnailPicker publicId={publicId} file={file} value={choice} onChange={setChoice} />
            <Link to={'/'} className="text-info-light underline">
              Open video
            </Link>
          </>
        )}
        <div className="flex gap-3">
          <Button type="submit" disabled={!file || busy || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {(phase === 'ready' || phase === 'error' || phase === 'pending') && (
            <Button type="button" onClick={reset}>
              Upload another
            </Button>
          )}
        </div>
      </form>
    </section>
  )
} 