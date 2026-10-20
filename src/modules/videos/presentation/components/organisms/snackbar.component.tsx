import { useSnackbar } from "../../hooks/snackbar.store"

export const Snackbar = () => {
  const snackbar = useSnackbar()
  if(!snackbar) return null

  return (
    <div
    role="status"
    aria-live="polite"
    className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-sm bg-background px-4 py-3 text-sm text-primary shadow-lg"
  >
    <span>{snackbar.message}</span>
    {snackbar.action && (
      <button type="button" onClick={snackbar.action.onClick} className="font-medium text-info-light">
        {snackbar.action.label}
      </button>
    )}
  </div>
  )
}
