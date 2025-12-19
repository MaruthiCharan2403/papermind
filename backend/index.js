
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
import userRoutes from './routes/userRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import pool from './db.js'; 
app.use(cors());

app.use(express.json());

pool.getConnection()
  .then(() => console.log('Connected to MySQL database.The data'))
  .catch(err => console.error('Database connection error:', err));
app.use('/api/user', userRoutes);
app.use('/api/paper', paperRoutes);
app.use('/api/query', queryRoutes);

app.listen(5000, () => {
  console.log('Express server running on https://papermindbackend.vercel.app');
});