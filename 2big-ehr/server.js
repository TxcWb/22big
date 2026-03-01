const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const VITALS_FILE = path.join(DATA_DIR, 'vitals.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- File helpers ---
function readJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return [];
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data saved to ${path.basename(file)}`);
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    throw err;
  }
}

// --- Auth ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  const { password: _pw, ...safeUser } = user;
  res.json(safeUser);
});

// --- Patients ---
app.get('/api/patients', (req, res) => {
  res.json(readJSON(PATIENTS_FILE));
});

app.get('/api/patients/active', (req, res) => {
  const patients = readJSON(PATIENTS_FILE);
  res.json(patients.filter(p => p.status === 'active'));
});

app.get('/api/patients/:id', (req, res) => {
  const patients = readJSON(PATIENTS_FILE);
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found.' });
  const vitals = readJSON(VITALS_FILE).filter(v => v.patientId === patient.id);
  res.json({ ...patient, vitals });
});

app.post('/api/patients', (req, res) => {
  const { name, age, gender, admissionDate } = req.body;
  if (!name || !age || !gender) {
    return res.status(400).json({ error: 'Name, age, and gender are required.' });
  }
  const patients = readJSON(PATIENTS_FILE);
  const newPatient = {
    id: 'P' + Date.now(),
    name: name.trim(),
    age: parseInt(age, 10),
    gender,
    admissionDate: admissionDate || new Date().toISOString().slice(0, 10),
    status: 'active'
  };
  patients.push(newPatient);
  writeJSON(PATIENTS_FILE, patients);
  res.status(201).json(newPatient);
});

app.post('/api/patients/:id/discharge', (req, res) => {
  const patients = readJSON(PATIENTS_FILE);
  const idx = patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Patient not found.' });
  if (patients[idx].status === 'discharged') {
    return res.status(400).json({ error: 'Patient is already discharged.' });
  }
  patients[idx].status = 'discharged';
  writeJSON(PATIENTS_FILE, patients);
  res.json(patients[idx]);
});

// --- Vitals ---
app.post('/api/vitals', (req, res) => {
  const { patientId, bp, temperature, heartRate, notes } = req.body;
  if (!patientId || !bp || !temperature || !heartRate) {
    return res.status(400).json({ error: 'patientId, bp, temperature, and heartRate are required.' });
  }
  const patients = readJSON(PATIENTS_FILE);
  if (!patients.find(p => p.id === patientId)) {
    return res.status(404).json({ error: 'Patient not found.' });
  }
  const vitals = readJSON(VITALS_FILE);
  const newVitals = {
    id: 'V' + Date.now(),
    patientId,
    bp,
    temperature,
    heartRate,
    notes: notes || '',
    date: new Date().toISOString()
  };
  vitals.push(newVitals);
  writeJSON(VITALS_FILE, vitals);
  res.status(201).json(newVitals);
});

app.get('/api/vitals/:patientId', (req, res) => {
  const vitals = readJSON(VITALS_FILE).filter(v => v.patientId === req.params.patientId);
  res.json(vitals);
});

// --- Dashboard Stats ---
app.get('/api/stats', (req, res) => {
  const patients = readJSON(PATIENTS_FILE);
  const vitals = readJSON(VITALS_FILE);
  const today = new Date().toISOString().slice(0, 10);
  const todaysVisits = vitals.filter(v => v.date && v.date.slice(0, 10) === today).length;
  res.json({
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.status === 'active').length,
    todaysVisits
  });
});

app.listen(PORT, () => {
  console.log(`2BIG EHR server running at http://localhost:${PORT}`);
});
