import { ChevronLeft } from "lucide-react";

interface Props {
  title: string;
  onBack: () => void
}

export const MenuHeader = ({ title, onBack }: Props) => (
  <button type="button" onClick={onBack} className="mb-1 flex w-full items-center gap-2 border-b border-white/15 px-3 pb-2.5 pt-1 font-medium hover:bg-white/10">
    <ChevronLeft size={18} />
    {title}
  </button>
)