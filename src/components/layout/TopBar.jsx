import { Menu, Sun, Moon } from "lucide-react";

export default function TopBar({ title, subtitle, setMobileOpen, theme, setTheme }) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-slate-900 font-semibold text-base truncate">{title}</h1>
          {subtitle && <p className="text-slate-400 text-xs truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">HR</div>
      </div>
    </header>
  );
}
