import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import path from 'path'
import userRoutes from './routes/user.route.js';
import jobRoutes from './routes/job.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json()); 


app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is running!' });
});


app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
