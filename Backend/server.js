import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/UserRoute.js';
import quizRoutes from './routes/QuizRoute.js';
import articleRoutes from './routes/ArticleRoute.js';
import dotenv from 'dotenv';
import Cssrouter from './routes/CssBattleRoute.js';


dotenv.config(); // Load environment variables

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors({
  origin: ['https://quiz-app-admin.onrender.com', 'https://train-urself.onrender.com','http://localhost:5173'], // Allow both origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials if necessary
}));

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/quiz', quizRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/CssBattle', Cssrouter);


// DB connection
connectDB();

// Ping endpoint to keep the backend awake
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'An error occurred', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
