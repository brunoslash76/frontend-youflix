import { useEffect, useState } from "react"

export const useDebouncedValue = <T>(value: T, delayMs: number) => {
  const [debounced, serDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      serDebounced(value)
    }, delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
