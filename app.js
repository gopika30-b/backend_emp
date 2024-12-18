const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'https://creativecrusader.netlify.app'}));

db.query(`
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeID VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber VARCHAR(10) NOT NULL,
    department VARCHAR(50) NOT NULL,
    dateOfJoining DATE NOT NULL,
    role VARCHAR(50) NOT NULL
  )
`, (err) => {
  if (err) throw err;
  console.log('Table is ready.');
});

app.post('/addEmployee', (req, res) => {
  const { employeeID, name, email, phoneNumber, department, dateOfJoining, role } = req.body;
  if (!employeeID || !name || !email || !phoneNumber || !department || !dateOfJoining || !role) {
    return res.status(400).json({ message: 'All fields are mandatory.' });
  }
  const query = `
    INSERT INTO employees (employeeID, name, email, phoneNumber, department, dateOfJoining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [employeeID, name, email, phoneNumber, department, dateOfJoining, role], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Employee ID or Email already exists.' });
      }
      return res.status(500).json({ message: 'Error adding employee.' });
    }
    res.status(201).json({ message: 'Employee added successfully.' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
