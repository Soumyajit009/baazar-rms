import { Upload } from "lucide-react";

export default function renderPreviewField(field) {
  const base = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-400";
  if (field.type === "Section Title") return <p className="font-semibold text-slate-800 text-sm pt-2">{field.label}</p>;
  if (field.type === "Divider") return <hr className="border-slate-200" />;
  if (field.type === "Paragraph") return <textarea disabled className={`${base} h-16`} placeholder={field.label} />;
  if (field.type === "Dropdown") return <select disabled className={base}><option>{field.label}</option></select>;
  if (field.type === "Radio Button") return (
    <div className="space-y-1">
      {(field.options || []).map((o) => (
        <label key={o} className="flex items-center gap-2 text-sm text-slate-500"><input type="radio" disabled /> {o}</label>
      ))}
    </div>
  );
  if (field.type === "Checkbox") return (
    <div className="space-y-1">
      {(field.options || ["Option"]).map((o) => (
        <label key={o} className="flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" disabled /> {o}</label>
      ))}
    </div>
  );
  if (field.type === "File Upload") return (
    <div className="border border-dashed border-slate-300 rounded-lg px-3 py-4 text-center text-xs text-slate-400 bg-slate-50">
      <Upload size={16} className="mx-auto mb-1 text-slate-300" /> Drag file here or click to upload
    </div>
  );
  return <input disabled className={base} placeholder={field.label} />;
}
