# Baazar RMS — Phase 1 Prototype

React + Vite + Tailwind UI prototype for the Baazar Recruitment Management System.
Covers the core flow: Form Builder → Publish → Candidate Portal → Submit → New Applications → Screening → Final Shortlist.

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Project Structure

```
src/
  main.jsx                     entry point
  App.jsx                      top-level state + routing between views
  index.css                    Tailwind directives
  data/constants.js            seed data, default form config, nav items
  utils/helpers.js              date formatting + CSV export
  components/
    Dashboard.jsx
    CandidatePortal.jsx        public-facing application form
    CandidateDrawer.jsx        candidate profile side panel
    NewApplications.jsx
    ScreeningProcess.jsx
    FinalShortlist.jsx
    AtsComingSoon.jsx          Phase 2 placeholder
    SettingsPage.jsx
    layout/
      Sidebar.jsx
      TopBar.jsx
    shared/
      StatusBadge.jsx
      StarRating.jsx
      Toast.jsx
      EmptyState.jsx
    FormBuilder/
      FormBuilder.jsx
      FieldRow.jsx
      QRPlaceholder.jsx
      previewField.jsx
```

## Notes for Phase 2 (full stack)

- Replace `SEED_APPLICATIONS` / in-memory state in `App.jsx` with real API calls (Node/Express + Supabase).
- `CandidatePortal.jsx` currently only captures the resume filename — wire actual file upload to Supabase Storage here.
- `QRPlaceholder.jsx` is a visual stand-in — swap for the `qrcode` library once there's a real public link to encode.
- `AtsComingSoon.jsx` is where the Python + spaCy resume scoring panel will go.
