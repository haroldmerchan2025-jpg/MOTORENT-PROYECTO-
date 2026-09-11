import express, { type Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Se agrega la extensión .js a la ruta relativa hacia las rutas
import motoRoutes from './routes/moto.routes.js';

import authRoutes from './routes/auth.routes'
import motoRoutes from './routes/moto.routes'

dotenv.config();

// Inicializar la aplicación de Express
const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

app.use('/api/auth, authRoutes');
app.use('/api', motoRoutes);

app.get('/', (req, res) => {
  res.send('Servidor MotoRent con TypeScript funcionando');
});

// Rutas de la API
app.use('/api/motos', motoRoutes);

export default app;