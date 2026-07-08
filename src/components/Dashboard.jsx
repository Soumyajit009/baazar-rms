import {
  Users, CalendarClock, ClipboardList, Filter as FilterIcon, Trophy, HardDrive,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import StatusBadge from "./shared/StatusBadge";
import { fmtDate, fmtDateTime } from "../utils/helpers";

export default function Dashboard({ applications, activityLog }) {
  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setDate(now.getDate() - 30);

  const total = applications.length;
  const today = applications.filter((a) => new Date(a.appliedAt) >= startOfDay).length;
  const thisWeek = applications.filter((a) => new Date(a.appliedAt) >= weekAgo).length;
  const thisMonth = applications.filter((a) => new Date(a.appliedAt) >= monthAgo).length;
  const inScreening = applications.filter((a) => a.status === "Screening").length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted" || a.status === "Selected").length;

  const cards = [
    { label: "Total Applications", value: total, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Applications", value: today, icon: CalendarClock, color: "text-green-600 bg-green-50" },
    { label: "This Week", value: thisWeek, icon: ClipboardList, color: "text-amber-600 bg-amber-50" },
    { label: "This Month", value: thisMonth, icon: ClipboardList, color: "text-violet-600 bg-violet-50" },
    { label: "In Screening", value: inScreening, icon: FilterIcon, color: "text-orange-600 bg-orange-50" },
    { label: "Final Shortlisted", value: shortlisted, icon: Trophy, color: "text-emerald-600 bg-emerald-50" },
    { label: "Resume Storage Used", value: "184 MB / 500 MB", icon: HardDrive, color: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800", isText: true },
  ];

  const perDay = [...Array(7)].map((_, i) => {
    const d = new Date(now); d.setDate(now.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-IN", { weekday: "short" });
    const count = applications.filter((a) => new Date(a.appliedAt).toDateString() === d.toDateString()).length;
    return { day: label, count };
  });

  const byPosition = Object.entries(
    applications.reduce((acc, a) => { acc[a.position] = (acc[a.position] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const byQualification = Object.entries(
    applications.reduce((acc, a) => { acc[a.qualification] = (acc[a.qualification] || 0) + 1; return acc; }, {})
  );

  const PIE_COLORS = ["#2563EB", "#F59E0B", "#16A34A", "#7C3AED", "#EF4444"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={18} />
            </div>
            <p className={`font-semibold text-slate-900 dark:text-white ${c.isText ? "text-sm" : "text-2xl"}`}>{c.value}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Applications Per Day</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={perDay}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Applications By Position</p>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byPosition} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {byPosition.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {byPosition.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {p.name} · {p.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Qualification Distribution</p>
          <div className="space-y-3">
            {byQualification.map(([label, count]) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{label}</span><span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</p>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {activityLog.slice(0, 8).map((a) => (
              <div key={a.id} className="flex gap-3 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-600 dark:text-slate-300">{a.msg}</p>
                  <p className="text-slate-400 dark:text-slate-500">{fmtDateTime(a.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800"><p className="text-sm font-semibold text-slate-900 dark:text-white">Recent Applications</p></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-2.5 font-medium">Candidate</th>
                <th className="text-left px-5 py-2.5 font-medium">Position</th>
                <th className="text-left px-5 py-2.5 font-medium">Applied</th>
                <th className="text-left px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...applications].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5).map((a) => (
                <tr key={a.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">{a.name}</td>
                  <td className="px-5 py-2.5 text-slate-500 dark:text-slate-400">{a.position}</td>
                  <td className="px-5 py-2.5 text-slate-500 dark:text-slate-400">{fmtDate(a.appliedAt)}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}