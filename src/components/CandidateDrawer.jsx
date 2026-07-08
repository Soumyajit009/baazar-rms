import { X, Mail, Phone as PhoneIcon, Download } from "lucide-react";
import { fmtDate } from "../utils/helpers";

export default function CandidateDrawer({ candidate, onClose, onMoveToScreening }) {
  if (!candidate) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-slate-900">Candidate Profile</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{candidate.name}</p>
            <p className="text-xs text-slate-400">{candidate.id}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-500"><Mail size={14} /> {candidate.email}</div>
          <div className="flex items-center gap-2 text-slate-500"><PhoneIcon size={14} /> {candidate.phone}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Position Applied</p>
            <p className="text-sm font-medium text-slate-800">{candidate.position}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Qualification</p>
            <p className="text-sm font-medium text-slate-800">{candidate.qualification}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Experience</p>
            <p className="text-sm font-medium text-slate-800">{candidate.experience}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Applied On</p>
            <p className="text-sm font-medium text-slate-800">{fmtDate(candidate.appliedAt)}</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs text-slate-400 mb-2">Resume</p>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5">
            <span className="text-sm text-slate-600 truncate">{candidate.resume}</span>
            <Download size={15} className="text-slate-400 shrink-0 cursor-pointer hover:text-blue-600" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          {candidate.status === "New" && (
            <button onClick={() => { onMoveToScreening(candidate.id); onClose(); }} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700">
              Move to Screening
            </button>
          )}
          <button onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Close</button>
        </div>
      </div>
    </div>
  );
}
