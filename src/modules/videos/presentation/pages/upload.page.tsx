import { useMemo, useState, type SubmitEvent } from "react"
import { Link } from "react-router"

import { Button } from "@/shared/components/atoms/button.component"
import { Input } from "@/shared/components/atoms/input.component"

import { FileDropOverlay } from "@/shared/components/organisms/file-drop-overlay.component"
import { useWindowFileDrop } from "@/shared/hooks/use-window-file-drop.hook"
import { useGetGenresQuery } from "../../infra/api/video.api"
import { useVideoUpload } from "../hooks/user-video-upload.hook"

const titleFromFile = (file: File) => file.name.replace(/\.[^.]+$/, '').slice(0, 255)

export const UploadPage = () => {
  const { data: genres = [], isLoading: genresLoading } = useGetGenresQuery()
  const { phase, progress, publicId, status, error, start, reset } = useVideoUpload()

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genreIds, setGenreIds] = useState<string[]>([])
  const onFileChange = (next: File | null) => {
    setFile(next)
    if (next && !title.trim()) {
      setTitle(titleFromFile(next))
    }
  }
  const busy = phase === 'creating' || phase === 'uploading' || phase === 'completing' || phase === 'processing'
  
  const { dragging } = useWindowFileDrop({ onDrop: onFileChange, disabled: busy })


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
        return 'Ready — your video is public when processing finishes.'
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
    if (!file || busy) return
    await start(file, { title, description, genreIds })
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
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a title that describes your video"
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            maxLength={5000}
            disabled={busy}
            rows={5}
            className="w-full p-2 rounded-xs border border-gray-300 font-light"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell viewers about your video"
          />
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
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1 rounded-md border text-sm ${selected ? 'bg-info-light text-black' : 'border-primary-light'
                    }`}
                >
                  {genre.name}
                </button>
              )
            })}
          </div>
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
        {phase === 'ready' && publicId && (
          <Link to={'/'} className="text-info-light underline">
            Open video
          </Link>
        )}
        <div className="flex gap-3">
          <Button type="submit" disabled={!file || busy}>
            {busy ? 'Working…' : 'Upload'}
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