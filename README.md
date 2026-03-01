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

### Manual Test Steps

1. Open the app and log in with any username and password.
2. On the Dashboard, verify stats (Total Patients, Active Patients, Today's Visits) load from localStorage.
3. Navigate to **Patients** and confirm two demo patients are pre-seeded on first visit.
4. Add a new patient; verify they appear immediately in the patient list.
5. Click a patient to open their detail page; record vitals and confirm they appear in the history.
6. Discharge a patient; verify the status badge changes and the Discharge button disappears.
7. Refresh the page and confirm all data persists.
8. Log out and confirm you are redirected to the login page.
