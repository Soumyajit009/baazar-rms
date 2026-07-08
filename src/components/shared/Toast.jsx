import { useEffect } from "react";
import { Check } from "lucide-react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
      <Check size={16} className="text-green-400" />
      {message}
    </div>
  );
}
