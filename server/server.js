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
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.get("/api/user/:id", (req, res) => {
  res.json({ msg: "User data" });
});
app.use('/api/auth', authRoutes);
app.use('/api/request', requestApiRoutes);
app.use('/api/history', historyRoutes);

app.listen(process.env.PORT, () => {

  console.log(`Server is running on port ${process.env.PORT}`);
});