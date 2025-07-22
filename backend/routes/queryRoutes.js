import express from 'express';
import pool from '../db.js';
import axios from 'axios';
import auth from '../middleware/auth.js'; 
const router = express.Router();

router.post('/ask', auth, async (req, res) => {
  const { paperId, question } = req.body;
  if (!paperId || !question)
    return res.status(400).json({ error: 'Missing paperId or question' });
  try {
    const [papers] = await pool.execute(
      'SELECT * FROM research_papers WHERE id = ?',
      [paperId]
    );
    if (!papers.length)
      return res.status(404).json({ error: 'Paper not found' });

    const s3_faiss_key = papers[0].s3_faiss_key;
    const flaskRes = await axios.post(process.env.FLASK_URL + '/ask', {
      s3_faiss_key,
      question
    });
    const answer = flaskRes.data.answer;
    await pool.execute(
      'INSERT INTO user_queries (user_id, paper_id, question, answer) VALUES (?, ?, ?, ?)',
      [req.user.userId, paperId, question, answer]
    );
    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

router.get('/history/:paperId', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_queries WHERE paper_id = ? AND user_id = ? ORDER BY asked_at DESC',
      [req.params.paperId, req.user.userId]
    );
    res.status(200).json({ queries: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;