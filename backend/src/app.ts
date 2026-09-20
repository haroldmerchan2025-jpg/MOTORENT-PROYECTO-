import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import motoRoutes from './routes/moto.routes.js';
import authroutes from './routes/auth.routes.js'

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación de Express
const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta principal de prueba
app.get('/', (_req, res) => {
  res.send('Servidor MotoRent con TypeScript funcionando');
});

app.use('/auth', authroutes)

// Rutas de la API
app.use('/api', motoRoutes);

export default app;