export const PlayerSpinner = () => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div role="status" aria-label="Carregando" className="h-14 w-14 animate-spin rounded-full border-4 border-white/25 border-t-white" />
  </div>
)