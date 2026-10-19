import { CameraIcon } from "lucide-react"

interface Props {
  open: boolean
  title?: string
  hint?: string
}

export const FileDropOverlay = ({ open, title, hint }: Props) => {
  return (
    <div
      aria-hidden={!open}
      className={`
        fixed
        inset-0
        z-50
        p-6
        pointer-events-none
        bg-primary-ghost-transparent
        backdrop-blur-sm
        transition-[translate,opacity]
        duration-300 ease-out
        motion-reduce:transition-none
        ${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className="h-full w-full flex flex-col items-center justify-center gap-2 rounded-xl border-4 border-dashed border-info-light">
        <CameraIcon className="w-22 h-22 text-info-light" />
        <h2>Drag and drop or click to choose a video</h2>
        <p className="text-h2 font-thin">{title}</p>
        <p className="text-sm text-primary">{hint}</p>
      </div>
    </div>
  )
}
