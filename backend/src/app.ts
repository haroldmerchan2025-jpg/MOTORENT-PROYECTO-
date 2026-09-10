import express from 'express';

const app = express(); 
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor MotoRent con TypeScript funcionando');
});

export default app;