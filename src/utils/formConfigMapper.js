// Converts a Supabase `job_forms` row (snake_case) into the shape
// the React app uses everywhere else (camelCase).
export function dbRowToFormConfig(row) {
  return {
    title: row.title,
    position: row.position,
    department: row.department || "",
    location: row.location || "",
    employmentType: row.employment_type || "",
    experienceRequired: row.experience_required || "",
    qualification: row.qualification || "",
    salary: row.salary || "",
    description: row.description || "",
    deadline: row.deadline || "",
    status: row.status || "Active",
    maxResumeSize: row.max_resume_size_kb || 750,
    acceptedFormats: row.accepted_formats || ["PDF", "DOCX"],
    autoClose: row.auto_close ?? true,
    maxApplications: row.max_applications || 500,
    successMessage: row.success_message || "",
    fields: row.fields || [],
  };
}

// Converts the app's formConfig (camelCase) back into a Supabase
// `job_forms` row (snake_case) ready to insert/update.
export function formConfigToDbRow(formConfig) {
  return {
    title: formConfig.title,
    position: formConfig.position,
    department: formConfig.department,
    location: formConfig.location,
    employment_type: formConfig.employmentType,
    experience_required: formConfig.experienceRequired,
    qualification: formConfig.qualification,
    salary: formConfig.salary,
    description: formConfig.description,
    deadline: formConfig.deadline || null,
    status: formConfig.status,
    max_resume_size_kb: Number(formConfig.maxResumeSize) || 750,
    accepted_formats: formConfig.acceptedFormats,
    auto_close: formConfig.autoClose,
    max_applications: Number(formConfig.maxApplications) || null,
    success_message: formConfig.successMessage,
    fields: formConfig.fields,
  };
}