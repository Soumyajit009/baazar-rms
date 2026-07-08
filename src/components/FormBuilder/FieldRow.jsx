import { GripVertical, ChevronUp, ChevronDown, Copy, Trash2 } from "lucide-react";
import { FIELD_TYPES } from "../../data/constants";

export default function FieldRow({ field, index, total, onUpdate, onDelete, onDuplicate, onMove }) {
  const needsOptions = ["Dropdown", "Checkbox", "Radio Button"].includes(field.type);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <GripVertical size={16} className="text-slate-300 mt-2 shrink-0" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={field.label}
            onChange={(e) => onUpdate({ ...field, label: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            placeholder="Field label"
          />
          <select
            value={field.type}
            onChange={(e) => onUpdate({ ...field, type: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {FIELD_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronUp size={15} /></button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronDown size={15} /></button>
          <button onClick={onDuplicate} className="p-1.5 rounded-lg hover:bg-slate-100"><Copy size={15} /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
        </div>
      </div>
      {needsOptions && (
        <input
          value={(field.options || []).join(", ")}
          onChange={(e) => onUpdate({ ...field, options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          className="ml-7 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Options, comma separated e.g. Male, Female, Other"
        />
      )}
      <label className="ml-7 flex items-center gap-2 text-xs text-slate-500">
        <input type="checkbox" checked={!!field.required} onChange={(e) => onUpdate({ ...field, required: e.target.checked })} className="rounded accent-blue-600" />
        Required field
      </label>
    </div>
  );
}
