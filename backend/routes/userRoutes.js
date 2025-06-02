import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js'; // 
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Registering user:', username);
  console.log('Password length:', password ? password.length : 'No password provided');
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash]
    );
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (!rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
    res.status(200).json({
      userId: user.id,
      username: user.username,
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;