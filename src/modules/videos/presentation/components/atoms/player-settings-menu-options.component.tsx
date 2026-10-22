import { Check } from "lucide-react";

interface Props {
  label: string;
  checked: boolean;
  onClick: () => void
}

export const MenuOption = ({ label, checked, onClick }: Props) => (
  <button type="button" role="menuitemradio" aria-checked={checked} onClick={onClick} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-white/10">
    <span className="w-4">{checked && <Check size={16} />}</span>
    {label}
  </button>
)