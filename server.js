import express from 'express';
import cors from 'cors';
import router from './routes/index';

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Token'],
  // credentials: true,
}));
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
