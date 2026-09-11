import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Se agrega la extensión .js a la ruta relativa hacia las rutas
import motoRoutes from './routes/moto.routes.js';

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

// Rutas de la API
app.use('/api/motos', motoRoutes);

export default app;