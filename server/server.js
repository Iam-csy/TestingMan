import express from 'express';
import cors from 'cors';
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();

import './config/db.js';
import authRoutes from './routes/user.routes.js';
import requestApiRoutes from './routes/requestApi.route.js';
import historyRoutes from './routes/history.routes.js';




app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/request', requestApiRoutes);
app.use('/api/history', historyRoutes);

app.listen(process.env.PORT, () => {

  console.log(`Server is running on port ${process.env.PORT}`);
});