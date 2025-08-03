import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-white shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4">
        <button onClick={onMenuClick} className="text-slate-600">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">OrderFlow</h1>
        <div className="w-6"></div>
      </div>
    </div>
  );
}
