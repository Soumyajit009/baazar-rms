import { useState } from "react";
import { Upload, Plus, Trash2, ScanSearch, CheckCircle2, XCircle, Loader2, GraduationCap } from "lucide-react";
import { extractTextFromFile } from "../utils/resumeTextExtractor";
import { scoreResumeAgainstRequirements, EDUCATION_TIER_DEFS } from "../utils/atsScoring";
import KeywordInput from "./shared/KeywordInput";

const DEFAULT_REQUIREMENTS = [
  { id: "r1", label: "Skills", keywords: ["Excel", "Communication"] },
  { id: "r2", label: "Experience", keywords: [] },
];

function RecommendationBadge({ recommendation }) {
  const styles = {
    Suitable: "bg-green-50 text-green-700 border-green-200",
    "Maybe Suitable": "bg-amber-50 text-amber-700 border-amber-200",
    "Not Suitable": "bg-red-50 text-red-700 border-red-200",
    "Not Scored": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${styles[recommendation]}`}>
      {recommendation}
    </span>
  );
}

export default function AtsResumeChecker() {
  const [file, setFile] = useState(null);
  const [requirements, setRequirements] = useState(DEFAULT_REQUIREMENTS);
  const [educationExtra, setEducationExtra] = useState({ tenth: [], twelfth: [], graduate: [] });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateRequirement = (id, updated) =>
    setRequirements((reqs) => reqs.map((r) => (r.id === id ? updated : r)));

  const deleteRequirement = (id) =>
    setRequirements((reqs) => reqs.filter((r) => r.id !== id));

  const addRequirement = () =>
    setRequirements((reqs) => [...reqs, { id: `r${Date.now()}`, label: "New Requirement", keywords: [] }]);

  const handleAnalyze = async () => {
    if (!file) { setError("Please upload a resume first."); return; }
    setError("");
    setAnalyzing(true);
    setResult(null);
    try {
      const text = await extractTextFromFile(file);
      const scored = scoreResumeAgainstRequirements(text, requirements, educationExtra);
      setResult(scored);
    } catch (err) {
      console.error("ATS analysis failed:", err);
      setError(err.message || "Could not analyze this file. Try a different resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-slate-900">Upload Resume</p>
          <label className={`border rounded-lg px-3 py-10 flex flex-col items-center justify-center text-sm cursor-pointer transition-colors ${
            file ? "border-green-400 bg-green-50 text-green-700" : "border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:bg-blue-50/30"
          }`}>
            <Upload size={22} className={`mb-2 ${file ? "text-green-600" : "text-slate-400"}`} />
            {file ? `${file.name} — ready to analyze` : "Drag & drop or click to upload (Max 750 KB, PDF/DOCX)"}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); setResult(null); setError(""); }
              }}
            />
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {analyzing ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><ScanSearch size={16} /> Analyze Resume</>}
          </button>
        </div>

        {result && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">Education Detected</p>
                <span className="text-xs text-slate-400">(informational — does not affect score)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.educationTiers.map((tier) => (
                  <span
                    key={tier.key}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
                      tier.passed ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    {tier.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {tier.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Overall Match Score</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {result.recommendation === "Not Scored" ? "—" : `${result.score}%`}
                  </p>
                </div>
                <RecommendationBadge recommendation={result.recommendation} />
              </div>

              {result.recommendation !== "Not Scored" && (
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${result.score >= 80 ? "bg-green-500" : result.score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              )}

              {result.breakdown.length > 0 && (
                <div className="space-y-4">
                  {result.breakdown.map((b) => (
                    <div key={b.label} className="border border-slate-100 rounded-lg p-3">
                      <p className="text-sm font-medium text-slate-800 mb-2">{b.label} ({b.matched.length}/{b.total} matched)</p>
                      <div className="flex flex-wrap gap-1.5">
                        {b.matched.map((k) => (
                          <span key={k} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            <CheckCircle2 size={11} /> {k}
                          </span>
                        ))}
                        {b.missing.map((k) => (
                          <span key={k} className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                            <XCircle size={11} /> {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.extractedSections.map((sec) => (
                <div key={sec.label} className="border border-slate-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-800 mb-2">{sec.label} (found in resume)</p>
                  {sec.entries.length > 0 ? (
                    <ul className="space-y-1">
                      {sec.entries.map((entry, i) => (
                        <li key={i} className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">{entry}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">No experience section detected in this resume.</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-slate-400" />
            <p className="text-sm font-semibold text-slate-900">Education (auto-detected)</p>
          </div>
          <p className="text-xs text-slate-400">
            10th, 12th, and Graduate are always checked automatically. Add extra words below only if your resume uses unusual phrasing.
          </p>
          {EDUCATION_TIER_DEFS.map((tier) => (
            <div key={tier.key}>
              <label className="text-xs text-slate-500 mb-1 block">{tier.label} — extra keywords</label>
              <KeywordInput
                value={educationExtra[tier.key] || []}
                onChange={(keywords) => setEducationExtra((prev) => ({ ...prev, [tier.key]: keywords }))}
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Requirements</p>
            <button onClick={addRequirement} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <Plus size={14} /> Add
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Leave "Experience" blank to just list what's found. Type keywords for anything you want scored.
          </p>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    value={req.label}
                    onChange={(e) => updateRequirement(req.id, { ...req, label: e.target.value })}
                    className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button onClick={() => deleteRequirement(req.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                <KeywordInput
                  value={req.keywords || []}
                  onChange={(keywords) => updateRequirement(req.id, { ...req, keywords })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}