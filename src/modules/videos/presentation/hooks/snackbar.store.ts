import { useSyncExternalStore } from "react"

export interface SnackbarAction {
  label: string
  onClick: () => void
}

interface Snackbar {
  id: number
  message: string
  action?: SnackbarAction
}

let current: Snackbar | null = null
let timer = 0
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(listener => listener())

export const notify = (message: string, action?: SnackbarAction) => {
  window.clearTimeout(timer)
  current = { id: Date.now(), message, action }
  emit()
  timer = window.setTimeout(() => {
    current = null
    emit()
  }, 5000)
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useSnackbar = () => useSyncExternalStore(subscribe, () => current)
