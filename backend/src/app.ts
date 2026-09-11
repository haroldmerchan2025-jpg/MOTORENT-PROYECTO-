import express, { type Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes'
import motoRoutes from './routes/moto.routes'

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth, authRoutes');
app.use('/api', motoRoutes);

app.get('/', (req, res) => {
  res.send('Servidor MotoRent con TypeScript funcionando');
});

export default app;