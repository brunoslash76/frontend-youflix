import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  file: File
  onCapture: (blob: Blob, previewUrl: string) => void
}

export const FrameTimeline = ({ file, onCapture }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const src = useMemo(() => URL.createObjectURL(file), [file])
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(src)
    }
  }, [src])

  const seek = (seconds: number) => {
    setTime(seconds)
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return

    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 1280 / video.videoWidth)
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (blob) onCapture(blob, URL.createObjectURL(blob))
    }, 'image/jpeg', 0.9)
  }

  if (unsupported) {
    return <p className="text-sm text-primary">This browser can't preview this file. Use a suggestion or upload an image.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="aspect-video w-full rounded-md bg-black"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setUnsupported(true)}
      />
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.04}
        value={time}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Pick a frame"
      />
      <button type="button" onClick={capture} className="self-start text-sm text-info-light underline">
        Use this frame ({time.toFixed(1)}s)
      </button>
    </div>
  )
}
