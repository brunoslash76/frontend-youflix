import { useEffect, useEffectEvent } from "react"
import type { Direction } from "../../domain/types/direction.type"

export interface PlayerKeyboardActions {
  togglePlay: () => void
  seekBy: (delta: number) => void
  seekToFraction: (fraction: number) => void
  changeVolume: (delta: number) => void
  toggleMute: () => void
  toggleFullscreen: () => void
  toggleTheater: () => void
  stepFrame: (direction: Direction) => void
  changeRate: (direction: Direction) => void
  onShortcut: () => void
}

const IGNORED_TARGETS = 'input,textarea, select, [contenteditable="true"]'

const runShortcut = (key: string, actions: PlayerKeyboardActions) => {
  switch (key) {
    case ' ':
    case 'k':
    case 'K':
      actions.togglePlay()
      return true
    case 'j':
    case 'J':
      actions.seekBy(-10)
      return true
    case 'l':
    case 'L':
      actions.seekBy(10)
      return true
    case 'ArrowLeft':
      actions.seekBy(-5)
      return true
    case 'ArrowRight':
      actions.seekBy(5)
      return true
    case 'ArrowUp':
      actions.changeVolume(0.05)
      return true
    case 'ArrowDown':
      actions.changeVolume(-0.05)
      return true
    case 'm':
    case 'M':
      actions.toggleMute()
      return true
    case 'f':
    case 'F':
      actions.toggleFullscreen()
      return true
    case 't':
    case 'T':
      actions.toggleTheater()
      return true
    case ',':
      actions.stepFrame(-1)
      return true
    case '.':
      actions.stepFrame(1)
      return true
    case '<':
      actions.changeRate(-1)
      return true
    case '>':
      actions.changeRate(1)
      return true
    case 'Home':
      actions.seekToFraction(0)
      return true
    case 'End':
      actions.seekToFraction(1)
      return true
    default:
      if (!/^[0-9]$/.test(key)) return false
      actions.seekToFraction(Number(key) / 10)
      return true
  }
}

export const usePlayerKeyboard = (actions: PlayerKeyboardActions) => {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return

    const target = event.target instanceof HTMLElement ? event.target : null

    if (target?.closest(IGNORED_TARGETS)) return

    if (event?.key === ' ' && target?.closest('button')) return

    if (!runShortcut(event.key, actions)) return

    event.preventDefault()
    actions.onShortcut()
  })

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })
}
