import { useEffect, useRef, useState } from "react"

interface Options {
  onDrop: (file: File) => void
  disabled?: boolean
}

const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes('Files')

export const useWindowFileDrop = ({ onDrop, disabled = false }: Options) => {
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)
  const onDropRef = useRef(onDrop)
  const disabledRef = useRef(disabled)

  useEffect(() => {
    onDropRef.current = onDrop
    disabledRef.current = disabled
  })

  useEffect(() => {
    const handleEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return

      event.preventDefault()
      depth.current += 1
      if (!disabledRef.current) setDragging(true)
    }

    const handleOver = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = disabledRef.current ? 'none' : 'copy'

    }

    const handleLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      depth.current = Math.max(0, depth.current - 1)
      if (depth.current === 0) setDragging(false)
    }

    const handleDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth.current = 0
      setDragging(false)
      const file = event.dataTransfer?.files[0]
      if (file && !disabledRef.current) onDropRef.current(file)
    }

    const cancel = () => {
      depth.current = 0
      setDragging(false)
    }

    window.addEventListener('dragenter', handleEnter)
    window.addEventListener('dragover', handleOver)
    window.addEventListener('dragleave', handleLeave)
    window.addEventListener('drop', handleDrop)
    window.addEventListener('blur', cancel)

    return () => {
      window.removeEventListener('dragenter', handleEnter)
      window.removeEventListener('dragover', handleOver)
      window.removeEventListener('dragleave', handleLeave)
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('blur', cancel)
    }
  })

  return { dragging }
}
