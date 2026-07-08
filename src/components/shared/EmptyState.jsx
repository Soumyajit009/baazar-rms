export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        <Icon size={22} className="text-slate-400 dark:text-slate-500" />
      </div>
      <p className="text-slate-700 dark:text-slate-200 font-medium text-sm">{title}</p>
      <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}