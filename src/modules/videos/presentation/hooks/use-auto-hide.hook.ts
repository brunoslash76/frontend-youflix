import { useEffect, useRef, useState } from "react"

const HIDE_AFTER_MS = 3000

export const useAutoHide = (keepVisible: boolean) => {
  const [active, setActive] = useState(true)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => window.clearTimeout(timerRef.current), [])

  const show = () => {
    setActive(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setActive(false), HIDE_AFTER_MS)
  }

  const hide = () => {
    window.clearTimeout(timerRef.current)
    setActive(false)
  }

  return {
    visible: keepVisible || active,
    show,
    hide,
  }
}
