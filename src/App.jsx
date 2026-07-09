import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { dbRowToFormConfig, formConfigToDbRow } from "./utils/formConfigMapper";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Dashboard from "./components/Dashboard";
import FormBuilder from "./components/FormBuilder/FormBuilder";
import CandidatePortal from "./components/CandidatePortal";
import CandidateDrawer from "./components/CandidateDrawer";
import NewApplications from "./components/NewApplications";
import ScreeningProcess from "./components/ScreeningProcess";
import FinalShortlist from "./components/FinalShortlist";
import AtsComingSoon from "./components/AtsComingSoon";
import SettingsPage from "./components/SettingsPage";
import Toast from "./components/shared/Toast";
import { DEFAULT_FORM, SEED_APPLICATIONS } from "./data/constants";
import { daysAgo } from "./utils/helpers";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);
  const [formConfig, setFormConfig] = useState(DEFAULT_FORM);
  const [formId, setFormId] = useState(null);
  const [published, setPublished] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [applications, setApplications] = useState(SEED_APPLICATIONS);
  const [drawerCandidate, setDrawerCandidate] = useState(null);
  const [toast, setToast] = useState(null);
  const [activityLog, setActivityLog] = useState([
    { id: 1, msg: "Form published for Store Manager", time: daysAgo(0) },
    { id: 2, msg: "Arjun Sen moved to Final Shortlist", time: daysAgo(3) },
    { id: 3, msg: "Rajesh Kumar moved to Screening", time: daysAgo(4) },
  ]);

const navigate = useNavigate();
const [session, setSession] = useState(null);
const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  const loadForm = async () => {
    const { data, error } = await supabase
      .from("job_forms")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to load form:", error);
    } else if (data) {
      setFormConfig(dbRowToFormConfig(data));
      setFormId(data.id);
      setPublished(data.status === "Active");
    }
    setLoadingForm(false);
  };
  loadForm();
}, []);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
    setAuthLoading(false);
  });

  const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
    setSession(newSession);
  });

  return () => listener.subscription.unsubscribe();
}, []);

const saveForm = async (statusValue) => {
  const payload = { ...formConfigToDbRow(formConfig), status: statusValue };
  let result;

  if (formId) {
    result = await supabase.from("job_forms").update(payload).eq("id", formId).select().single();
  } else {
    result = await supabase.from("job_forms").insert(payload).select().single();
  }

  if (result.error) {
    console.error("Failed to save form:", result.error);
    showToast("Failed to save form — check console");
    return;
  }

  setFormId(result.data.id);
  setFormConfig(dbRowToFormConfig(result.data));
  setPublished(statusValue === "Active");
};

  const showToast = (msg) => setToast(msg);
  const logActivity = (msg) => setActivityLog((log) => [{ id: Date.now(), msg, time: new Date().toISOString() }, ...log]);

  const updateStatus = (id, status, extra = {}) =>
    setApplications((apps) => apps.map((a) => (a.id === id ? { ...a, status, ...extra } : a)));

  const handleMoveToScreening = (id) => { updateStatus(id, "Screening"); logActivity(`Moved ${id} to Screening`); showToast("Moved to Screening"); };
  const handleMoveToShortlist = (id) => { updateStatus(id, "Shortlisted"); logActivity(`Moved ${id} to Final Shortlist`); showToast("Moved to Final Shortlist"); };
  const handleDelete = (id) => setApplications((apps) => apps.filter((a) => a.id !== id));
  const handleReject = (id) => { updateStatus(id, "Rejected"); showToast("Candidate rejected"); };
  const handleHold = (id) => { updateStatus(id, "Hold"); showToast("Candidate put on hold"); };
  const handleRate = (id, rating) => updateStatus(id, applications.find((a) => a.id === id).status, { rating });
  const handleNotes = (id, notes) => updateStatus(id, applications.find((a) => a.id === id).status, { notes });
  const handleInterviewStatus = (id, interviewStatus) => updateStatus(id, applications.find((a) => a.id === id).status, { interviewStatus });
  const handleMarkSelected = (id) => { updateStatus(id, "Selected"); logActivity(`${id} marked as Selected`); showToast("Candidate marked as selected"); };

  const handleCandidateSubmit = (values, config) => {
    const nextNum = applications.length + 1;
    const id = `CAND-2026-${String(nextNum).padStart(4, "0")}`;
    const findVal = (labelPart) => {
      const field = config.fields.find((f) => f.label.toLowerCase().includes(labelPart));
      return field ? values[field.id] || "" : "";
    };
    const record = {
      id,
      name: findVal("full name") || "Candidate",
      phone: findVal("mobile") || "-",
      email: findVal("email") || "-",
      qualification: findVal("qualification") || "-",
      experience: findVal("experience") || "-",
      position: config.position,
      resume: findVal("resume") || "resume.pdf",
      appliedAt: new Date().toISOString(),
      status: "New",
      rating: 0,
      notes: "",
      interviewStatus: "Not Scheduled",
    };
    setApplications((apps) => [...apps, record]);
    logActivity(`${record.name} applied for ${config.position}`);
    return record;
  };

if (authLoading) return null;

if (!session && window.location.pathname !== "/apply") {
     return <Login onLoginSuccess={() => {}} />;
   }

  const titles = {
    dashboard: ["Dashboard", "Overview of hiring activity"],
    builder: ["Candidate Form Builder", "Design and publish your application form"],
    new: ["New Applications", "Fresh submissions awaiting review"],
    screening: ["Screening Process", "Manual review and HR rating"],
    shortlist: ["Final Shortlist", "Candidates moving to interview"],
    ats: ["ATS Resume Checker", "Independent resume scoring tool"],
    settings: ["Settings", "Company and system preferences"],
  };

  const hrPortal = view === "candidate"
  ? <CandidatePortal formConfig={formConfig} onSubmit={handleCandidateSubmit} onExit={() => setView("builder")} />
  : (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-slate-950" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onPreview={() => setView("candidate")} onLogout={() => supabase.auth.signOut()} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={titles[view][0]} subtitle={titles[view][1]} setMobileOpen={setMobileOpen} theme={theme} setTheme={setTheme} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {view === "dashboard" && <Dashboard applications={applications} activityLog={activityLog} />}
          {view === "builder" && (
            <FormBuilder
              formConfig={formConfig}
              setFormConfig={setFormConfig}
              published={published}
              onPublish={() => saveForm("Active")}
              onSaveDraft={() => saveForm("Inactive")}
              onPreview={() => setView("candidate")}
              showToast={showToast}
            />
          )}
          {view === "new" && <NewApplications applications={applications} onMoveToScreening={handleMoveToScreening} onDelete={handleDelete} onView={setDrawerCandidate} />}
          {view === "screening" && <ScreeningProcess applications={applications} onRate={handleRate} onNotes={handleNotes} onReject={handleReject} onHold={handleHold} onMoveToShortlist={handleMoveToShortlist} />}
          {view === "shortlist" && <FinalShortlist applications={applications} onInterviewStatus={handleInterviewStatus} onMarkSelected={handleMarkSelected} onReject={handleReject} />}
          {view === "ats" && <AtsComingSoon />}
          {view === "settings" && <SettingsPage showToast={showToast} />}
        </main>
      </div>
      <CandidateDrawer candidate={drawerCandidate} onClose={() => setDrawerCandidate(null)} onMoveToScreening={handleMoveToScreening} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );

  return (
    <Routes>
      <Route path="/apply" element={<CandidatePortal formConfig={formConfig} onSubmit={handleCandidateSubmit} isPublic />} />
      <Route path="/*" element={hrPortal} />
    </Routes>
  );
}
