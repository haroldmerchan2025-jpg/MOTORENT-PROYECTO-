import {Router} from 'express';
import {obtenerMotos, crearMoto} from '../controllers/moto.controller';
import {verificarToken} from '../middleware/auth.middleware';

const router = Router();

router.get('/motos', obtenerMotos);
router.post('/motos', verificarToken, crearMoto);

export default router;
import { Router } from "express";
// Se agrega la extensión .js a la ruta relativa hacia el controlador
import { getMotos, createMoto } from "../controllers/moto.controller.js";

// Crear el enrutador modular para el recurso de motocicletas
const router = Router();

// Endpoint GET /api/motos -> Llama a la función que lista todas las motos
router.get("/", getMotos);

// Endpoint POST /api/motos -> Llama a la función que inserta una moto
router.post("/", createMoto);

// Exportar el módulo de rutas para vincularlo en app.ts
export default router;
