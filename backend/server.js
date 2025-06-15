const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // ✅ Load .env file

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// SSL Certificate (required by TiDB Cloud)
const certificatePath = path.join(__dirname, 'ca.pem');
if (!fs.existsSync(certificatePath)) {
  console.error('🔴 CA file not found at:', certificatePath);
  process.exit(1);
}

// ✅ Connect to TiDB Cloud using .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(certificatePath),
  },
});

db.connect((err) => {
  if (err) {
    console.error('🔴 DB connection error:', err.message);
    return;
  }
  console.log('✅ Connected to TiDB Cloud');
});

// 🌐 Root Test Route
app.get('/', (req, res) => {
  res.send('Hello from Express + TiDB!');
});

// ✅ Register (Sign Up) Route
app.post('/submit', async (req, res) => {
  const { name, email, password, dateOfBirth, role = 'user' } = req.body;

  if (!name || !email || !password || !dateOfBirth) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, date_of_birth, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, dateOfBirth, role], (err) => {
      if (err) {
        console.error('🔴 Insert error:', err.message);
        return res.status(500).send('Internal server error');
      }
      res.send('✅ User registered successfully!');
    });
  } catch (err) {
    console.error('🔴 Hash error:', err.message);
    res.status(500).send('Internal server error');
  }
});

// ✅ Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  const sql = 'SELECT * FROM users WHERE name = ? OR email = ?';
  db.query(sql, [username, username], async (err, results) => {
    if (err) {
      console.error('🔴 Login query error:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful', role: user.role });
  });
});

// ✅ Get all users
app.get('/users', (req, res) => {
  db.query('SELECT id, name, email, date_of_birth, role FROM users', (err, results) => {
    if (err) {
      console.error('🔴 Query error:', err.message);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// ✅ Get single user
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT id, name, email, date_of_birth, role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('🔴 Query error:', err.message);
      return res.status(500).send('Database error');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  });
});

// ✅ Update user
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, dateOfBirth, role } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const fields = [];
    const values = [];

    if (name) fields.push('name = ?'), values.push(name);
    if (email) fields.push('email = ?'), values.push(email);
    if (hashedPassword) fields.push('password = ?'), values.push(hashedPassword);
    if (dateOfBirth) fields.push('date_of_birth = ?'), values.push(dateOfBirth);
    if (role) fields.push('role = ?'), values.push(role);

    if (fields.length === 0) {
      return res.status(400).send('No fields to update');
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    db.query(sql, values, (err) => {
      if (err) {
        console.error('🔴 Update error:', err.message);
        return res.status(500).send('Database error');
      }
      res.send('✅ User updated');
    });
  } catch (err) {
    console.error('🔴 Hashing error:', err.message);
    res.status(500).send('Internal server error');
  }
});

// ✅ Delete user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error('🔴 Delete error:', err.message);
      return res.status(500).send('Database error');
    }
    res.send('🗑️ User deleted');
  });
});

// ✅ Hash password (for testing)
app.post('/hash-password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).send('Password is required');
    const hashed = await bcrypt.hash(password, 10);
    res.json({ hashedPassword: hashed });
  } catch (err) {
    console.error('🔴 Hashing error:', err);
    res.status(500).send('Internal server error');
  }
});

// =======================
// 🔑 Forgot Password Routes
// =======================

// Step 1: Verify Email Exists
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send('Email is required');

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('🔴 Forgot password - email check error:', err.message);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(404).send('Email not found');
    }

    res.send('Email verified');
  });
});

// Step 2: Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send('Missing email or new password');
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE email = ?';

    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('🔴 Reset password error:', err.message);
        return res.status(500).send('Database error');
      }

      if (result.affectedRows === 0) {
        return res.status(404).send('Email not found');
      }

      res.send('Password updated successfully');
    });
  } catch (err) {
    console.error('🔴 Hash error:', err.message);
    res.status(500).send('Internal server error');
  }
});

// =======================
// Start Server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
});
