import { Download, Trophy } from "lucide-react";
import StarRating from "./shared/StarRating";
import StatusBadge from "./shared/StatusBadge";
import EmptyState from "./shared/EmptyState";
import { exportCSV } from "../utils/helpers";

export default function FinalShortlist({ applications, onInterviewStatus, onMarkSelected, onReject }) {
  const rows = applications.filter((a) => a.status === "Shortlisted" || a.status === "Selected");
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Final Shortlist</p>
        <button onClick={() => exportCSV(rows, "final_shortlist.csv")} className="text-sm px-3 py-2 rounded-lg border border-slate-200 font-medium text-slate-600 flex items-center gap-1.5"><Download size={14} /> Export</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Candidate</th>
              <th className="text-left px-4 py-2.5 font-medium">HR Rating</th>
              <th className="text-left px-4 py-2.5 font-medium">Interview Status</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="text-left px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.position}</p>
                </td>
                <td className="px-4 py-3"><StarRating value={r.rating} size={14} /></td>
                <td className="px-4 py-3">
                  <select value={r.interviewStatus} onChange={(e) => onInterviewStatus(r.id, e.target.value)} className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                    <option>Not Scheduled</option><option>Scheduled</option><option>Completed</option>
                  </select>
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => onMarkSelected(r.id)} className="text-xs px-2.5 py-1.5 rounded-lg bg-green-600 text-white font-medium">Mark Selected</button>
                    <button onClick={() => onReject(r.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 font-medium">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyState icon={Trophy} title="No shortlisted candidates yet" subtitle="Candidates moved from Screening will appear here." />}
      </div>
    </div>
  );
}
