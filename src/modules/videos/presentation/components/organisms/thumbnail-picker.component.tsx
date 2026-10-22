import { useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetVideoQuery } from "../../../infra/api/video.api"
import type { ThumbnailChoice } from "../../pages/upload.page"
import { FrameTimeline } from "../molecules/frame-timeline.component"


interface ThumbnailPickerProps {
  publicId: string
  file: File
  value: ThumbnailChoice | null
  onChange: (choice: ThumbnailChoice) => void
}

export const ThumbnailPicker = ({ publicId, file, value, onChange }: ThumbnailPickerProps) => {
  const [done, setDone] = useState(false)
  const { data: video, isLoading, isError } = useGetVideoQuery(publicId, {
    pollingInterval: done ? 0 : 2000,
  })

  if (!done && (video?.status === 'ready' || video?.status === 'failed')) setDone(true)

  useEffect(() => {
    if (!value && video?.thumbnailOptions.length) onChange({ source: 'suggested', index: 0 })
  }, [value, video?.thumbnailOptions.length, onChange])


  return (
    <fieldset disabled={isLoading} className="flex flex-col gap-2">
      <legend className="mb-2">Thumbnail</legend>
      {video?.thumbnailOptions.length ? (
        <>
          <p className="text-sm text-primary">Pick the frame that best represents your video.</p>
          <div className="grid grid-cols-3 gap-3">
            {video.thumbnailOptions.map((url, index) => {
              const selected = value?.source === 'suggested' && value.index === index

              return (
                <button
                  key={url}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ source: 'suggested', index })}
                  className={`
                    aspect-video 
                    overflow-hidden 
                    rounded-md 
                    border-2 
                    cursor-pointer 
                    disabled:cursor-wait 
                    ${selected ? 'border-info-light' : 'border-transparent hover:border-primary-light'}
                  `}
                >
                  <img src={url} alt={`Thumbnail option ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className='aspect-video overflow-hidden rounded-md border-2 disabled:cursor-wait' />
          <Skeleton className='aspect-video overflow-hidden rounded-md border-2 disabled:cursor-wait' />
          <Skeleton className='aspect-video overflow-hidden rounded-md border-2 disabled:cursor-wait' />
          <Skeleton className='aspect-video overflow-hidden rounded-md border-2 disabled:cursor-wait' />
          <Skeleton className='aspect-video overflow-hidden rounded-md border-2 disabled:cursor-wait' />
          <Skeleton className='aspect-video overflow-hidden rounded-md border-2 disabled:cursor-wait' />
        </div>
      )}
      <FrameTimeline file={file} onCapture={(blob, previewUrl) => onChange({ source: 'custom', blob, previewUrl })} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const image = e.target.files?.[0]
          if (image) onChange({ source: 'custom', blob: image, previewUrl: URL.createObjectURL(image) })
        }}
      />
      {isError && <p className="text-sm text-danger">Could not load the video. Try again.</p>}
    </fieldset>
  )
}
