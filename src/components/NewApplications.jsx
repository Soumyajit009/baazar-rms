import { useState } from "react";
import { Search, Download, Trash2, Eye, ChevronRight, Inbox } from "lucide-react";
import StatusBadge from "./shared/StatusBadge";
import EmptyState from "./shared/EmptyState";
import { fmtDateShortTime, exportCSV } from "../utils/helpers";

export default function NewApplications({ applications, onMoveToScreening, onDelete, onView }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);

  const rows = applications.filter((a) => a.status === "New").filter((a) =>
    (filter === "All" || a.position === filter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
  );
  const positions = ["All", ...new Set(applications.map((a) => a.position))];
  const allSelected = rows.length > 0 && selected.length === rows.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, ID..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
          {positions.map((p) => <option key={p}>{p}</option>)}
        </select>
        {selected.length > 0 && (
          <>
            <button onClick={() => { selected.forEach(onMoveToScreening); setSelected([]); }} className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white font-medium">Move to Screening ({selected.length})</button>
            <button onClick={() => exportCSV(rows.filter((r) => selected.includes(r.id)), "selected_applications.csv")} className="text-sm px-3 py-2 rounded-lg border border-slate-200 font-medium text-slate-600 flex items-center gap-1.5"><Download size={14} /> Export</button>
            <button onClick={() => { selected.forEach(onDelete); setSelected([]); }} className="text-sm px-3 py-2 rounded-lg border border-red-200 text-red-500 font-medium flex items-center gap-1.5"><Trash2 size={14} /> Delete</button>
          </>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[880px]">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2.5"><input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.id) : [])} className="accent-blue-600" /></th>
              <th className="text-left px-4 py-2.5 font-medium">Candidate ID</th>
              <th className="text-left px-4 py-2.5 font-medium">Name</th>
              <th className="text-left px-4 py-2.5 font-medium">Phone</th>
              <th className="text-left px-4 py-2.5 font-medium">Position</th>
              <th className="text-left px-4 py-2.5 font-medium">Applied</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="text-left px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(r.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, r.id] : selected.filter((s) => s !== r.id))} className="accent-blue-600" /></td>
                <td className="px-4 py-3 text-slate-500 text-xs">{r.candidateCode}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-slate-500">{r.phone}</td>
                <td className="px-4 py-3 text-slate-500">{r.position}</td>
                <td className="px-4 py-3 text-slate-500">{fmtDateShortTime(r.appliedAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(r)} title="View" className="p-1.5 rounded-lg hover:bg-slate-100"><Eye size={15} className="text-slate-500" /></button>
                    <button title="Download resume" className="p-1.5 rounded-lg hover:bg-slate-100"><Download size={15} className="text-slate-500" /></button>
                    <button onClick={() => onMoveToScreening(r.id)} title="Move to Screening" className="p-1.5 rounded-lg hover:bg-blue-50"><ChevronRight size={15} className="text-blue-600" /></button>
                    <button onClick={() => onDelete(r.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={15} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyState icon={Inbox} title="No new applications" subtitle="Submissions from your candidate form will appear here." />}
      </div>
    </div>
  );
}
