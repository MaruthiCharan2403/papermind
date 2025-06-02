import express from 'express';
import pool from '../db.js';
import axios from 'axios';
import auth from '../middleware/auth.js'; // Middleware to check authentication
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.post('/upload', auth, async (req, res) => {
  const { title } = req.body;
  console.log('Received title:', title);
  if (!title) return res.status(400).json({ error: 'Missing PDF file or title' });
  console.log('Processing title:', title);
  //check whether the title exists in the database
  const [existing] = await pool.execute(
    'SELECT * FROM research_papers WHERE title = ?',
    [title]
  );
  console.log('Existing papers:', existing);
  if (existing.length>=1) return res.status(505).json({ error: 'Paper with this title already exists' });
  try {
    const flaskRes = await axios.post('http://127.0.0.1:5001/process-paper', {
    title
    });
    const s3_faiss_key = flaskRes.data.s3_faiss_key;
    const [result] = await pool.execute(
      'INSERT INTO research_papers (title, s3_faiss_key, uploaded_by) VALUES (?, ?, ?)',
      [title, s3_faiss_key, req.user.userId]
    );
    res.status(201).json({ paperId: result.insertId, title, s3_faiss_key });
  } catch (err) {
    res.status(500).json({ error: 'Paper processing failed' });
  }
});

router.get('/my-papers', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM research_papers WHERE uploaded_by = ? ORDER BY uploaded_at DESC',
      [req.user.userId]
    );
    res.json({ papers: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/all-papers', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT rp.*, u.username FROM research_papers rp
       JOIN users u ON rp.uploaded_by = u.id
       ORDER BY rp.uploaded_at DESC`
    );
    res.status(200).json({ papers: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:paperId', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM research_papers WHERE id = ? AND uploaded_by = ?',
      [req.params.paperId, req.user.userId]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'Paper not found' });
    res.json({ paper: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


//get all papers with the username of the uploader


export default router;