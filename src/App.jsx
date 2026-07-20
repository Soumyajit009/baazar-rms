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
import { DEFAULT_FORM } from "./data/constants";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";

// Converts a Supabase applications row (joined with candidates + resumes)
// into the flat shape every table/component in this app expects.
function dbRowToApplication(row) {
  return {
    id: row.id,
    candidateCode: row.candidate_code,
    name: row.candidates?.full_name || "Unknown",
    phone: row.candidates?.phone || "-",
    email: row.candidates?.email || "-",
    qualification: row.qualification || "-",
    experience: row.experience || "-",
    position: row.position || "-",
    resume: row.resumes?.[0]?.file_name || "—",
    appliedAt: row.applied_at,
    status: row.status,
    rating: row.rating || 0,
    notes: row.notes || "",
    interviewStatus: row.interview_status || "Not Scheduled",
  };
}

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

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [drawerCandidate, setDrawerCandidate] = useState(null);
  const [toast, setToast] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const showToast = (msg) => setToast(msg);
  const logActivity = (msg) => setActivityLog((log) => [{ id: Date.now(), msg, time: new Date().toISOString() }, ...log]);

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

  const loadApplications = async () => {
    setLoadingApplications(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*, candidates(full_name, phone, email), resumes(file_name)")
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("Failed to load applications:", error);
    } else {
      setApplications((data || []).map(dbRowToApplication));
    }
    setLoadingApplications(false);
  };

  useEffect(() => {
    if (!session) return;
    loadApplications();

    const channel = supabase
      .channel("applications-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        loadApplications();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

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

  const updateApplication = async (id, updates) => {
    const dbUpdates = {};
    if ("status" in updates) dbUpdates.status = updates.status;
    if ("rating" in updates) dbUpdates.rating = updates.rating;
    if ("notes" in updates) dbUpdates.notes = updates.notes;
    if ("interviewStatus" in updates) dbUpdates.interview_status = updates.interviewStatus;

    setApplications((apps) => apps.map((a) => (a.id === id ? { ...a, ...updates } : a)));

    const { error } = await supabase.from("applications").update(dbUpdates).eq("id", id);
    if (error) {
      console.error("Failed to update application:", error);
      showToast("Failed to save change — check console");
      loadApplications();
    }
  };

  const handleMoveToScreening = (id) => { updateApplication(id, { status: "Screening" }); logActivity("Candidate moved to Screening"); showToast("Moved to Screening"); };
  const handleMoveToShortlist = (id) => { updateApplication(id, { status: "Shortlisted" }); logActivity("Candidate moved to Final Shortlist"); showToast("Moved to Final Shortlist"); };
  const handleReject = (id) => { updateApplication(id, { status: "Rejected" }); showToast("Candidate rejected"); };
  const handleHold = (id) => { updateApplication(id, { status: "Hold" }); showToast("Candidate put on hold"); };
  const handleResume = (id) => { updateApplication(id, { status: "Screening" }); showToast("Candidate resumed"); };
  const handleRate = (id, rating) => updateApplication(id, { rating });
  const handleNotes = (id, notes) => updateApplication(id, { notes });
  const handleInterviewStatus = (id, interviewStatus) => updateApplication(id, { interviewStatus });
  const handleMarkSelected = (id) => { updateApplication(id, { status: "Selected" }); logActivity("Candidate marked as Selected"); showToast("Candidate marked as selected"); };

  const handleDelete = async (id) => {
    setApplications((apps) => apps.filter((a) => a.id !== id));
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete application:", error);
      showToast("Failed to delete — check console");
      loadApplications();
    }
  };

  const handleCandidateSubmitted = (candidateName, position) => {
    logActivity(`${candidateName} applied for ${position}`);
    if (session) loadApplications();
  };

  const titles = {
    dashboard: ["Dashboard", "Overview of hiring activity"],
    builder: ["Candidate Form Builder", "Design and publish your application form"],
    new: ["New Applications", "Fresh submissions awaiting review"],
    screening: ["Screening Process", "Manual review and HR rating"],
    shortlist: ["Final Shortlist", "Candidates moving to interview"],
    ats: ["ATS Resume Checker", "Independent resume scoring tool"],
    settings: ["Settings", "Company and system preferences"],
  };

  if (authLoading) return null;

  if (!session && window.location.pathname !== "/apply") {
    return <Login onLoginSuccess={() => {}} />;
  }

  const hrPortal = view === "candidate"
    ? (
      <CandidatePortal
        formConfig={formConfig}
        formId={formId}
        onSubmitted={handleCandidateSubmitted}
        onExit={() => setView("builder")}
      />
    )
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
            {view === "screening" && <ScreeningProcess applications={applications} onRate={handleRate} onNotes={handleNotes} onReject={handleReject} onHold={handleHold} onResume={handleResume} onMoveToShortlist={handleMoveToShortlist} />}
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
      <Route
        path="/apply"
        element={
          <CandidatePortal
            formConfig={formConfig}
            formId={formId}
            onSubmitted={handleCandidateSubmitted}
            isPublic
          />
        }
      />
      <Route path="/*" element={hrPortal} />
    </Routes>
  );
}