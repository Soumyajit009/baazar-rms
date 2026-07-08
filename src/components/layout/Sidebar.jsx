import { Eye, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../../data/constants";

export default function Sidebar({ view, setView, mobileOpen, setMobileOpen, onPreview }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed md:static z-40 md:z-auto top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">B</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Baazar RMS</p>
            <p className="text-slate-500 text-xs leading-tight">Recruitment Suite</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setView(item.key); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon size={17} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button onClick={onPreview} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-slate-800 hover:text-white transition-colors">
            <Eye size={17} />
            Preview Candidate Form
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
