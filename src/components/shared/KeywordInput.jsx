import { useState, useEffect } from "react";

export default function KeywordInput({ value, onChange, className }) {
  const [text, setText] = useState((value || []).join(", "));

  useEffect(() => {
    setText((value || []).join(", "));
  }, [value]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onChange(text.split(",").map((s) => s.trim()).filter(Boolean))}
      placeholder="Keywords, comma separated e.g. Excel, SQL, Power BI"
      className={className || "w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40"}
    />
  );
}