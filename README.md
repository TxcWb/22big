# Tubig
Electronic Patient Health Record

## 2BIG EHR – Demo

This is a **demo-only, fully static** deployment of the 2BIG EPHR application.

### Demo Login

Enter username or password to log-in.
### Data Storage

All data (patients, vitals) is stored in your browser's **localStorage**. This means:

- Data persists across page refreshes within the same browser.
- Data is **not** shared between browsers or devices.
- Clearing browser storage will reset all data.
- There is no server-side persistence; no network/API calls are made.

### Patient Seeding from JSON

On first load (and whenever localStorage contains no record of a given patient ID), patients are automatically seeded from `2big-ehr/data/patients.json` into `localStorage`:

- **New patients** in `patients.json` (by `id`) that are not yet in localStorage are added automatically.
- **Existing patients** already in localStorage are never overwritten — localStorage is authoritative for edits.
- If the JSON file is unavailable (e.g. when running `file://` locally without a server), the app falls back to two built-in demo patients on first use.
- To add new patients to the seeded set, edit `data/patients.json` and reload; new IDs will be merged in without affecting local edits.

### Manual Test Steps

1. Open the app and log in with any username and password.
2. On the Dashboard, verify stats (Total Patients, Active Patients, Today's Visits) load from localStorage.
3. Navigate to **Patients** and confirm patients from `data/patients.json` are pre-seeded on first visit (falls back to two demo patients if the file is unavailable).
4. Add a new patient; verify they appear immediately in the patient list.
5. Click a patient to open their detail page; record vitals and confirm they appear in the history.
6. Discharge a patient; verify the status badge changes and the Discharge button disappears.
7. Refresh the page and confirm all data persists.
8. Log out and confirm you are redirected to the login page.
