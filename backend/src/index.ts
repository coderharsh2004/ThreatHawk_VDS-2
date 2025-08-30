// import express from 'express';
// import cors from 'cors';
// import authRouter from './routes/auth';
// import scanRouter from './routes/scan';
// import * as dotenv from 'dotenv';


// dotenv.config();

// const app = express();

// // Enable CORS for the Next.js frontend
// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.json());

// // Mount routes
// app.use('/api/auth', authRouter);
// app.use('/api/scan-and-scrape', scanRouter);
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend is working properly!' });
// });

// app.listen(5000, () => {
//   console.log('Backend running on http://localhost:5000');
// });

// console.log('FLASK_API_URL:', process.env.FLASK_API_URL);
// console.log('FLASK_API_URL:', process.env.FLASK_API_URL);
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import scanRouter from './routes/scan';
import userHistoryRouter from './routes/user_history';
import * as dotenv from 'dotenv';
import chatbotRoutes from './routes/chat';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/scan-and-scrape', scanRouter);
app.use('/api/user-history', userHistoryRouter);
app.use('/api/chat', chatbotRoutes);

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});