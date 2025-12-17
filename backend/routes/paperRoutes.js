import express from 'express';
import pool from '../db.js';
import axios from 'axios';
import auth from '../middleware/auth.js'; 
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.post('/upload', auth, async (req, res) => {
  const { name,title } = req.body;
  console.log(name, title);
  if (!title) return res.status(400).json({ error: 'Missing PDF file or title' });
  //check whether the title exists in the database
  const [existing] = await pool.execute(
    'SELECT * FROM research_papers WHERE title = ?',
    [title]
  );
  if (existing.length>=1) return res.status(505).json({ error: 'Paper with this title already exists' });
  try {
    // First, create the paper record to get the paper_id
    const [result] = await pool.execute(
      'INSERT INTO research_papers (name, title, s3_faiss_key, uploaded_by) VALUES (?, ?, ?, ?)',
      [name, title, 'chroma_collection', req.user.userId]
    );
    
    const paperId = result.insertId;
    
    // Send to Flask with paper_id
    const flaskRes = await axios.post('http://13.220.57.143:5001/process-paper', {
      title,
      paper_id: paperId
    });
    
    res.status(201).json({ 
      paperId: paperId, 
      title, 
      message: flaskRes.data.message 
    });
  } catch (err) {
    console.error('Paper processing error:', err);
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


//add an other user paper to the user research papers
router.post('/add-paper', auth, async (req, res) => {
  const { paperId } = req.body;
  if (!paperId) return res.status(400).json({ error: 'Missing paper ID' });

  try {
    // Check if the paper exists
    const [paperRows] = await pool.execute(
      'SELECT * FROM research_papers WHERE id = ?',
      [paperId]
    );
    if (!paperRows.length) return res.status(404).json({ error: 'Paper not found' });

    // Check if the paper is already added by the user
    const [existingRows] = await pool.execute(
      'SELECT * FROM research_papers WHERE uploaded_by = ? AND title = ?',
      [req.user.userId, paperRows[0].title]
    );
    if (existingRows.length) return res.status(409).json({ error: 'Paper already added' });

    // Add the paper to the user's collection (referencing same Chroma data via paper ID)
    await pool.execute(
      'INSERT into research_papers (name, title, s3_faiss_key, uploaded_by) VALUES (?, ?, ?, ?)',
      [paperRows[0].name, paperRows[0].title, 'chroma_collection', req.user.userId]
    );

    res.status(201).json({ message: 'Paper added successfully' });
  } catch (err) {
    console.error('Add paper error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete a paper
router.delete('/:paperId', auth, async (req, res) => {
  const { paperId } = req.params;
  
  try {
    // Check if paper exists and belongs to user
    const [papers] = await pool.execute(
      'SELECT * FROM research_papers WHERE id = ? AND uploaded_by = ?',
      [paperId, req.user.userId]
    );
    
    if (!papers.length) {
      return res.status(404).json({ error: 'Paper not found or unauthorized' });
    }
    
    // Delete from Chroma collection
    try {
      await axios.post('http://13.220.57.143:5001/delete-paper', {
        paper_id: paperId
      });
    } catch (flaskErr) {
      console.error('Flask delete error:', flaskErr);
      // Continue with database deletion even if Flask fails
    }
    
    // Delete from database (queries will be cascade deleted if FK is set up properly)
    await pool.execute(
      'DELETE FROM user_queries WHERE paper_id = ?',
      [paperId]
    );
    
    await pool.execute(
      'DELETE FROM research_papers WHERE id = ?',
      [paperId]
    );
    
    res.status(200).json({ message: 'Paper deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;