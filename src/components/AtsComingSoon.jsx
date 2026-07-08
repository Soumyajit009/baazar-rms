import { ScanSearch } from "lucide-react";

export default function AtsComingSoon() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
        <ScanSearch size={26} className="text-blue-600" />
      </div>
      <p className="font-semibold text-slate-900">ATS Resume Checker — Phase 2</p>
      <p className="text-slate-400 text-sm mt-1.5 max-w-md mx-auto">
        Automated resume scoring (skills match, experience match, keyword match) runs on a dedicated
        Python + spaCy service. We'll wire this in once the core hiring flow is approved.
      </p>
    </div>
  );
}
