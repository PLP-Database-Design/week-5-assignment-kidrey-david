const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth, gender, language FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving patients' });
      return;
    }
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_speciality, email_address, phone_number, date_joined FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving providers' });
      return;
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
  const { firstName } = req.query;
  if (!firstName) {
    res.status(400).json({ error: 'First name is required' });
    return;
  }
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error filtering patients' });
      return;
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query;
  if (!specialty) {
    res.status(400).json({ error: 'Specialty is required' });
    return;
  }
  const query = 'SELECT * FROM providers WHERE provider_speciality = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving providers by specialty' });
      return;
    }
    res.json(results);
  });
});

// 5. Retrieve visits for a specific patient
app.get('/patients/:patientId/visits', (req, res) => {
  const { patientId } = req.params;
  const query = 'SELECT * FROM visits WHERE patient_id = ?';
  db.query(query, [patientId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving patient visits' });
      return;
    }
    res.json(results);
  });
});

// 6. Retrieve ED visits for a specific patient
app.get('/patients/:patientId/ed-visits', (req, res) => {
  const { patientId } = req.params;
  const query = 'SELECT * FROM ed_visits WHERE patient_id = ?';
  db.query(query, [patientId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving patient ED visits' });
      return;
    }
    res.json(results);
  });
});

// 7. Retrieve admissions for a specific patient
app.get('/patients/:patientId/admissions', (req, res) => {
  const { patientId } = req.params;
  const query = 'SELECT * FROM admissions WHERE patient_id = ?';
  db.query(query, [patientId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving patient admissions' });
      return;
    }
    res.json(results);
  });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});