import AdminsSection from "./AdminsSection";

export default function SettingsPage({ showToast }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl space-y-5">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Company Name</label>
          <input defaultValue="Baazar Retail Pvt. Ltd." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Data Retention — Auto Delete</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
            <option>3 Days</option><option>5 Days</option><option>7 Days</option><option>30 Days</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Resume Size Limit (KB)</label>
            <input defaultValue="750" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Allowed File Types</label>
            <input defaultValue="PDF, DOCX" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>
        </div>
        <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">Email settings and backups connect once fully deployed.</p>
      </div>

      <AdminsSection showToast={showToast} />
    </div>
  );
}