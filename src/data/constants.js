import {
  LayoutDashboard, FileEdit, Inbox, Filter as FilterIcon, Trophy, ScanSearch,
  Settings as SettingsIcon,
} from "lucide-react";
import { daysAgo } from "../utils/helpers";

export const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Screening: "bg-amber-50 text-amber-700 border-amber-200",
  Shortlisted: "bg-violet-50 text-violet-700 border-violet-200",
  Selected: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Hold: "bg-slate-100 text-slate-600 border-slate-200",
};

export const DEFAULT_FIELDS = [
  { id: "f1", label: "Full Name", type: "Short Text", required: true },
  { id: "f2", label: "Mobile Number", type: "Phone Number", required: true },
  { id: "f3", label: "Email", type: "Email", required: true },
  { id: "f4", label: "Gender", type: "Radio Button", required: true, options: ["Male", "Female", "Other"] },
  { id: "f5", label: "Date of Birth", type: "Date", required: true },
  { id: "f6", label: "Address", type: "Paragraph", required: false },
  { id: "f7", label: "State", type: "Dropdown", required: true, options: ["West Bengal", "Bihar", "Jharkhand", "Odisha", "Assam", "Other"] },
  { id: "f8", label: "City", type: "Short Text", required: true },
  { id: "f9", label: "Qualification", type: "Dropdown", required: true, options: ["High School", "Diploma", "Graduate", "Post Graduate", "Doctorate"] },
  { id: "f10", label: "College / Institute", type: "Short Text", required: false },
  { id: "f11", label: "Passing Year", type: "Number", required: false },
  { id: "f12", label: "Experience", type: "Dropdown", required: true, options: ["Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"] },
  { id: "f13", label: "Current Company", type: "Short Text", required: false },
  { id: "f14", label: "Expected Salary", type: "Number", required: false },
  { id: "f15", label: "Skills", type: "Paragraph", required: false },
  { id: "f16", label: "Languages Known", type: "Short Text", required: false },
  { id: "f17", label: "Resume Upload", type: "File Upload", required: true },
];

export const DEFAULT_FORM = {
  title: "Store Manager Recruitment 2026",
  position: "Store Manager",
  department: "Operations",
  location: "Kolkata, West Bengal",
  employmentType: "Full-Time",
  experienceRequired: "2-4 Years",
  qualification: "Graduate",
  salary: "₹25,000 - ₹35,000 / month",
  description: "Baazar Retail is hiring a Store Manager to lead daily store operations, team performance, and customer experience at one of our Eastern India locations.",
  deadline: "2026-08-15",
  status: "Active",
  maxResumeSize: 750,
  acceptedFormats: ["PDF", "DOCX"],
  autoClose: true,
  maxApplications: 500,
  successMessage: "Thank you for applying! Our HR team will review your application and get back to you within 5-7 business days.",
  fields: DEFAULT_FIELDS,
};

export const SEED_APPLICATIONS = [
  { id: "CAND-2026-0001", name: "Ankita Roy", phone: "9830012345", email: "ankita.roy@example.com", qualification: "Graduate", experience: "1-3 Years", position: "Store Manager", resume: "ankita_roy_resume.pdf", appliedAt: daysAgo(0), status: "New", rating: 0, notes: "", interviewStatus: "Not Scheduled" },
  { id: "CAND-2026-0002", name: "Suvam Das", phone: "9831045678", email: "suvam.das@example.com", qualification: "Post Graduate", experience: "3-5 Years", position: "Cashier", resume: "suvam_das_cv.pdf", appliedAt: daysAgo(0), status: "New", rating: 0, notes: "", interviewStatus: "Not Scheduled" },
  { id: "CAND-2026-0003", name: "Priya Sharma", phone: "9051123456", email: "priya.sharma@example.com", qualification: "Graduate", experience: "Fresher", position: "Sales Associate", resume: "priya_sharma_resume.docx", appliedAt: daysAgo(2), status: "New", rating: 0, notes: "", interviewStatus: "Not Scheduled" },
  { id: "CAND-2026-0004", name: "Rajesh Kumar", phone: "9812234567", email: "rajesh.kumar@example.com", qualification: "Graduate", experience: "3-5 Years", position: "Store Manager", resume: "rajesh_kumar_resume.pdf", appliedAt: daysAgo(4), status: "Screening", rating: 4, notes: "Strong retail ops background.", interviewStatus: "Not Scheduled" },
  { id: "CAND-2026-0005", name: "Meena Iyer", phone: "9433345678", email: "meena.iyer@example.com", qualification: "Post Graduate", experience: "1-3 Years", position: "Cashier", resume: "meena_iyer_cv.pdf", appliedAt: daysAgo(6), status: "Screening", rating: 3, notes: "", interviewStatus: "Not Scheduled" },
  { id: "CAND-2026-0006", name: "Arjun Sen", phone: "9674456789", email: "arjun.sen@example.com", qualification: "Graduate", experience: "5+ Years", position: "Store Manager", resume: "arjun_sen_resume.pdf", appliedAt: daysAgo(10), status: "Shortlisted", rating: 5, notes: "Excellent interview, prior Big Bazaar experience.", interviewStatus: "Scheduled" },
  { id: "CAND-2026-0007", name: "Debolina Ghosh", phone: "9337567890", email: "debolina.ghosh@example.com", qualification: "Diploma", experience: "1-3 Years", position: "Sales Associate", resume: "debolina_ghosh_cv.docx", appliedAt: daysAgo(18), status: "New", rating: 0, notes: "", interviewStatus: "Not Scheduled" },
];

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "builder", label: "Candidate Form Builder", icon: FileEdit },
  { key: "new", label: "New Applications", icon: Inbox },
  { key: "screening", label: "Screening Process", icon: FilterIcon },
  { key: "shortlist", label: "Final Shortlist", icon: Trophy },
  { key: "ats", label: "ATS Resume Checker", icon: ScanSearch },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

export const FIELD_TYPES = ["Short Text", "Paragraph", "Email", "Phone Number", "Date", "Number", "Dropdown", "Checkbox", "Radio Button", "File Upload", "Section Title", "Divider"];
