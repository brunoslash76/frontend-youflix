import type { ButtonHTMLAttributes, ReactNode } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

export const PlayerIconButton = ({ label, children, className = '', ...props }: Props) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white ${className}`}
    {...props}
  >
    {children}
  </button>
)
