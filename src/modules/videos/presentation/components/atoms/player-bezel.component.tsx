import { Pause, Play } from 'lucide-react'
export type BezelIcon = 'play' | 'pause'
export const PlayerBezel = ({ icon }: { icon: BezelIcon }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="flex h-16 w-16 animate-player-bezel items-center justify-center rounded-full bg-black/60 text-white">
      {icon === 'play' ? <Play size={30} fill="currentColor" /> : <Pause size={30} fill="currentColor" />}
    </div>
  </div>
)