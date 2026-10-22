import { ChevronRight } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onClick: () => void
}

export const MenuRow = ({ label, value, onClick }: Props) => (
  <button type="button" role="menuitem" onClick={onClick} className="flex w-full items-center justify-between gap-6 px-4 py-2.5 hover:bg-white/10">
    <span>{label}</span>
    <span className="flex items-center gap-1 text-white/70">
      {value}
      <ChevronRight size={16} />
    </span>
  </button>
)