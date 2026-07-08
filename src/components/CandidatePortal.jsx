import { useState } from "react";
import { Check, ArrowLeft, Upload } from "lucide-react";
import { fmtDate } from "../utils/helpers";

export default function CandidatePortal({ formConfig, onSubmit, onExit, isPublic = false }) {
  const [values, setValues] = useState({});
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");

  const setVal = (id, v) => setValues((old) => ({ ...old, [id]: v }));

  const handleSubmit = () => {
    const missing = formConfig.fields.find((f) => f.required && !["Section Title", "Divider"].includes(f.type) && !values[f.id]);
    if (missing) { setError(`Please fill "${missing.label}" before submitting.`); return; }
    if (!declared) { setError("Please accept the declaration to continue."); return; }
    setError("");
    const record = onSubmit(values, formConfig);
    setSubmitted(record);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Check size={26} className="text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Application Submitted Successfully</h2>
          <p className="text-slate-500 text-sm mb-4">{formConfig.successMessage}</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 mb-6">
            Reference ID: <span className="font-semibold text-slate-900">{submitted.id}</span>
          </div>
          {!isPublic ? (
  <button onClick={onExit} className="text-sm text-blue-600 font-medium hover:underline">Exit Preview</button>
) : (
  <p className="text-xs text-slate-400">You may now close this window.</p>
)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {!isPublic && (
  <button onClick={onExit} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-4">
    <ArrowLeft size={13} /> Exit Preview
  </button>
)}
        <div className="bg-white border-t-4 border-blue-600 rounded-xl shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-bold text-slate-900">{formConfig.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{formConfig.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{formConfig.department}</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{formConfig.location}</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{formConfig.employmentType}</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Deadline: {fmtDate(formConfig.deadline)}</span>
          </div>

          <div className="mt-6 space-y-4">
            {formConfig.fields.map((f) => {
              if (f.type === "Section Title") return <p key={f.id} className="font-semibold text-slate-800 text-sm pt-3 border-t border-slate-100">{f.label}</p>;
              if (f.type === "Divider") return <hr key={f.id} className="border-slate-200" />;
              return (
                <div key={f.id}>
                  <label className="text-sm text-slate-600 mb-1.5 block">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
                  {f.type === "Paragraph" && (
                    <textarea onChange={(e) => setVal(f.id, e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500" />
                  )}
                  {f.type === "Dropdown" && (
                    <select onChange={(e) => setVal(f.id, e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                      <option value="">Select {f.label}</option>
                      {(f.options || []).map((o) => <option key={o}>{o}</option>)}
                    </select>
                  )}
                  {f.type === "Radio Button" && (
                    <div className="flex flex-wrap gap-4">
                      {(f.options || []).map((o) => (
                        <label key={o} className="flex items-center gap-2 text-sm text-slate-600">
                          <input type="radio" name={f.id} onChange={() => setVal(f.id, o)} className="accent-blue-600" /> {o}
                        </label>
                      ))}
                    </div>
                  )}
                  {f.type === "Checkbox" && (
                    <div className="flex flex-wrap gap-4">
                      {(f.options || ["Yes"]).map((o) => (
                        <label key={o} className="flex items-center gap-2 text-sm text-slate-600">
                          <input type="checkbox" onChange={(e) => setVal(f.id, e.target.checked ? o : "")} className="accent-blue-600" /> {o}
                        </label>
                      ))}
                    </div>
                  )}
                  {f.type === "File Upload" && (
                    <label className="border border-dashed border-slate-300 rounded-lg px-3 py-6 flex flex-col items-center justify-center text-xs text-slate-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30">
                      <Upload size={18} className="mb-1 text-slate-400" />
                      {values[f.id] ? values[f.id] : `Click to upload (Max ${formConfig.maxResumeSize} KB, ${formConfig.acceptedFormats.join("/")})`}
                      <input type="file" className="hidden" onChange={(e) => setVal(f.id, e.target.files?.[0]?.name || "resume.pdf")} />
                    </label>
                  )}
                  {["Short Text", "Email", "Phone Number", "Date", "Number"].includes(f.type) && (
                    <input
                      type={f.type === "Email" ? "email" : f.type === "Date" ? "date" : f.type === "Number" ? "number" : f.type === "Phone Number" ? "tel" : "text"}
                      onChange={(e) => setVal(f.id, e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  )}
                </div>
              );
            })}

            <label className="flex items-start gap-2 text-xs text-slate-500 pt-2">
              <input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} className="mt-0.5 accent-blue-600" />
              I hereby declare that the information provided above is true and accurate to the best of my knowledge.
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-blue-700 shadow-sm">
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
