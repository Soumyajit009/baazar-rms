// Fixed internal synonym lists for the three mandatory education tiers.
// These always run in the background. HR can extend each tier with extra
// custom keywords (e.g. "X" for 10th Pass) via the UI — those get merged
// in at detection time, on top of this base list.
const EDUCATION_TIERS = [
  {
    key: "tenth",
    label: "10th Pass",
    keywords: ["10th", "X Standard", "Matriculation", "SSC", "Secondary School", "Class 10", "Madhyamik", "Std X"],
  },
  {
    key: "twelfth",
    label: "12th Pass",
    keywords: ["12th", "XII", "HS", "Higher Secondary", "Intermediate", "Class 12", "HSC", "Std XII"],
  },
  {
    key: "graduate",
    label: "Graduate",
    keywords: [
      "Graduate", "Bachelor",
      "B.A", "BA", "Bachelor of Arts",
      "B.Sc", "BSc", "Bachelor of Science",
      "B.Com", "BCom", "Bachelor of Commerce",
      "B.Tech", "BTech", "Bachelor of Technology",
      "B.E", "BE", "Bachelor of Engineering",
      "BBA", "Bachelor of Business Administration",
      "BCA", "B.C.A", "Bachelor of Computer Application", "Bachelor of Computer Applications",
      "B.Pharm", "BPharm", "Bachelor of Pharmacy",
      "LLB", "Bachelor of Laws",
      "B.Ed", "BEd", "Bachelor of Education",
      "PGDM", "Post Graduate",
    ],
  },
];

export const EDUCATION_TIER_DEFS = EDUCATION_TIERS.map((t) => ({ key: t.key, label: t.label }));

const EXPERIENCE_HEADINGS = [
  "work experience", "professional experience", "experience", "employment history", "career history",
];

const NEXT_SECTION_HEADINGS = [
  "education", "skills", "projects", "certifications", "achievements", "languages",
  "declaration", "references", "hobbies", "interests", "personal details", "summary", "objective",
];

export function detectEducationTiers(resumeText, extraKeywords = {}) {
  const textLower = resumeText.toLowerCase();
  const results = EDUCATION_TIERS.map((tier) => {
    const allKeywords = [...tier.keywords, ...(extraKeywords[tier.key] || [])];
    return {
      key: tier.key,
      label: tier.label,
      passed: allKeywords.some((k) => k && textLower.includes(k.toLowerCase())),
      inferred: false,
    };
  });

  // A higher qualification implies all lower ones are complete too —
  // no need to find "10th" explicitly if "B.Tech" was already found.
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].passed) {
      for (let j = i - 1; j >= 0; j--) {
        if (!results[j].passed) {
          results[j].passed = true;
          results[j].inferred = true;
        }
      }
      break;
    }
  }

  return results;
}

export function extractExperienceSection(resumeText) {
  const flatText = resumeText;
  const lowerFlat = flatText.toLowerCase();

  let startIdx = -1;
  for (const heading of EXPERIENCE_HEADINGS) {
    const idx = lowerFlat.indexOf(heading);
    if (idx !== -1 && (startIdx === -1 || idx < startIdx)) startIdx = idx;
  }

  if (startIdx === -1) return [];

  let endIdx = flatText.length;
  for (const heading of NEXT_SECTION_HEADINGS) {
    const idx = lowerFlat.indexOf(heading, startIdx + 10);
    if (idx !== -1 && idx < endIdx) endIdx = idx;
  }

  const chunk = flatText.slice(startIdx, endIdx);
  const entries = chunk
    .split(/\s{2,}|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && s.length < 120)
    .slice(0, 8);

  return entries;
}

export function scoreResumeAgainstRequirements(resumeText, requirements, educationExtra = {}) {
  const textLower = resumeText.toLowerCase();
  let totalKeywords = 0;
  let matchedKeywords = 0;

  const breakdown = requirements
    .filter((req) => (req.keywords || []).length > 0)
    .map((req) => {
      const keywords = req.keywords.map((k) => k.trim()).filter(Boolean);
      const matched = keywords.filter((k) => textLower.includes(k.toLowerCase()));
      const missing = keywords.filter((k) => !textLower.includes(k.toLowerCase()));
      totalKeywords += keywords.length;
      matchedKeywords += matched.length;
      return { label: req.label, matched, missing, total: keywords.length };
    });

  const extractedSections = requirements
    .filter((req) => (req.keywords || []).length === 0 && req.label.toLowerCase().includes("experience"))
    .map((req) => ({ label: req.label, entries: extractExperienceSection(resumeText) }));

  const score = totalKeywords > 0 ? Math.round((matchedKeywords / totalKeywords) * 100) : 0;

  let recommendation = "Not Suitable";
  if (totalKeywords === 0) recommendation = "Not Scored";
  else if (score >= 80) recommendation = "Suitable";
  else if (score >= 50) recommendation = "Maybe Suitable";

  return {
    score,
    breakdown,
    extractedSections,
    recommendation,
    matchedKeywords,
    totalKeywords,
    educationTiers: detectEducationTiers(resumeText, educationExtra),
  };
}

export function scoreToStars(score) {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}