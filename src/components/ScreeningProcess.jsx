import { useState } from "react";
import { Search, Filter as FilterIcon } from "lucide-react";
import StarRating from "./shared/StarRating";
import EmptyState from "./shared/EmptyState";

export default function ScreeningProcess({ applications, onRate, onNotes, onReject, onHold, onMoveToShortlist }) {
  const [search, setSearch] = useState("");
  const rows = applications.filter((a) => a.status === "Screening" && a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
        </div>
        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">ATS scoring arrives in Phase 2</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Candidate</th>
              <th className="text-left px-4 py-2.5 font-medium">Position</th>
              <th className="text-left px-4 py-2.5 font-medium">HR Rating</th>
              <th className="text-left px-4 py-2.5 font-medium">Notes</th>
              <th className="text-left px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.id}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.position}</td>
                <td className="px-4 py-3"><StarRating value={r.rating} onChange={(v) => onRate(r.id, v)} /></td>
                <td className="px-4 py-3 w-64">
                  <input
                    defaultValue={r.notes}
                    onBlur={(e) => onNotes(r.id, e.target.value)}
                    placeholder="Add HR notes..."
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => onMoveToShortlist(r.id)} className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium">Shortlist</button>
                    <button onClick={() => onHold(r.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 font-medium">Hold</button>
                    <button onClick={() => onReject(r.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 font-medium">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyState icon={FilterIcon} title="No candidates in screening" subtitle="Move candidates here from New Applications to begin review." />}
      </div>
    </div>
  );
}
