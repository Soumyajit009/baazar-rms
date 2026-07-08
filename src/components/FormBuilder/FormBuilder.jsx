import { Plus, Copy, Link2, QrCode } from "lucide-react";
import FieldRow from "./FieldRow";
import QRPlaceholder from "./QRPlaceholder";
import renderPreviewField from "./previewField";

export default function FormBuilder({ formConfig, setFormConfig, published, onPublish, onSaveDraft, onPreview, showToast }) {
  const updateField = (id, updated) => {
    setFormConfig((f) => ({ ...f, fields: f.fields.map((fl) => (fl.id === id ? updated : fl)) }));
  };
  const deleteField = (id) => setFormConfig((f) => ({ ...f, fields: f.fields.filter((fl) => fl.id !== id) }));
  const duplicateField = (field) => {
    const copy = { ...field, id: `f${Date.now()}`, label: field.label + " (copy)" };
    setFormConfig((f) => {
      const idx = f.fields.findIndex((fl) => fl.id === field.id);
      const next = [...f.fields];
      next.splice(idx + 1, 0, copy);
      return { ...f, fields: next };
    });
  };
  const moveField = (index, dir) => {
    setFormConfig((f) => {
      const next = [...f.fields];
      const [item] = next.splice(index, 1);
      next.splice(index + dir, 0, item);
      return { ...f, fields: next };
    });
  };
  const addField = () => {
    const nf = { id: `f${Date.now()}`, label: "New Field", type: "Short Text", required: false };
    setFormConfig((f) => ({ ...f, fields: [...f.fields, nf] }));
  };

  const slug = formConfig.position.toLowerCase().replace(/\s+/g, "-");
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const publicLink = `${appUrl}/apply/${slug}`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Job Details</p>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${published ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
              {published ? "Published" : "Draft"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["title", "Form Title"], ["position", "Job Position"], ["department", "Department"], ["location", "Location"],
              ["employmentType", "Employment Type"], ["experienceRequired", "Experience Required"], ["qualification", "Qualification"], ["salary", "Salary (Optional)"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                <input
                  value={formConfig[key]}
                  onChange={(e) => setFormConfig((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Job Description</label>
            <textarea
              value={formConfig.description}
              onChange={(e) => setFormConfig((f) => ({ ...f, description: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Application Deadline</label>
              <input type="date" value={formConfig.deadline} onChange={(e) => setFormConfig((f) => ({ ...f, deadline: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Status</label>
              <select value={formConfig.status} onChange={(e) => setFormConfig((f) => ({ ...f, status: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Form Fields</p>
            <button onClick={addField} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg">
              <Plus size={15} /> Add Field
            </button>
          </div>
          <div className="space-y-3">
            {formConfig.fields.map((field, i) => (
              <FieldRow
                key={field.id}
                field={field}
                index={i}
                total={formConfig.fields.length}
                onUpdate={(u) => updateField(field.id, u)}
                onDelete={() => deleteField(field.id)}
                onDuplicate={() => duplicateField(field)}
                onMove={(dir) => moveField(i, dir)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-slate-900">Form Settings</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Maximum Resume Size (KB)</label>
              <input type="number" value={formConfig.maxResumeSize} onChange={(e) => setFormConfig((f) => ({ ...f, maxResumeSize: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Maximum Applications</label>
              <input type="number" value={formConfig.maxApplications} onChange={(e) => setFormConfig((f) => ({ ...f, maxApplications: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {["PDF", "DOCX"].map((fmt) => (
              <label key={fmt} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formConfig.acceptedFormats.includes(fmt)}
                  onChange={(e) => setFormConfig((f) => ({
                    ...f,
                    acceptedFormats: e.target.checked ? [...f.acceptedFormats, fmt] : f.acceptedFormats.filter((x) => x !== fmt),
                  }))}
                  className="rounded accent-blue-600"
                />
                Accept {fmt}
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={formConfig.autoClose} onChange={(e) => setFormConfig((f) => ({ ...f, autoClose: e.target.checked }))} className="rounded accent-blue-600" />
              Auto close after deadline
            </label>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Custom Success Message</label>
            <textarea value={formConfig.successMessage} onChange={(e) => setFormConfig((f) => ({ ...f, successMessage: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-16 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => { onSaveDraft(); showToast("Draft saved"); }} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Save Draft</button>
          <button onClick={onPreview} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Preview</button>
          <button onClick={() => { onPublish(); showToast("Form published"); }} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm">Publish</button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sticky top-20">
          <p className="text-sm font-semibold text-slate-900 mb-3">Live Preview</p>
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 max-h-80 overflow-y-auto bg-slate-50/50">
            <p className="font-semibold text-slate-800 text-sm">{formConfig.title}</p>
            {formConfig.fields.map((f) => (
              <div key={f.id}>
                {f.type !== "Section Title" && f.type !== "Divider" && (
                  <label className="text-xs text-slate-500 mb-1 block">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
                )}
                {renderPreviewField(f)}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-slate-900">Share Form</p>
          <QRPlaceholder value={publicLink} />
          <p className="text-xs text-slate-400 text-center">Visual QR preview — connects to a live generator once the backend is wired up.</p>
          <div className="flex items-center gap-2">
            <input readOnly value={publicLink} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 bg-slate-50" />
            <button
              onClick={() => { navigator.clipboard?.writeText(publicLink).catch(() => {}); showToast("Link copied to clipboard"); }}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <Copy size={15} className="text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onPreview} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <Link2 size={13} /> Open Form
            </button>
            <button onClick={() => showToast("QR download available once connected to backend")} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <QrCode size={13} /> Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
