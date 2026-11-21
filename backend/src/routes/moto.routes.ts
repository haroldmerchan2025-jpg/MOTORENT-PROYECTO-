import { Router } from "express";
import { getMotos, createMoto } from "../controllers/moto.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { verificarPerfil } from "../middleware/validatePerfil.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/motos:
 *   get:
 *     summary: Obtener todas las motos
 *     description: Consulta las motos registradas en MotoRent.
 *     tags:
 *       - Motos
 *     responses:
 *       200:
 *         description: Motos obtenidas correctamente
 *       500:
 *        description: Error interno del servidor
 */

router.get("/motos", getMotos);


/**
 * @openapi
 * /api/create/moto:
 *   post:
 *     summary: Registrar una nueva moto
 *     description: Permite registrar una moto en MotoRent.
 *     tags:
 *       - Motos
 *     security:
 *       - autenticacionJWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - licensePlate
 *               - dailyRate
 *               - displacement
 *               - color
 *               - KM
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Yamaha
 *               model:
 *                 type: string
 *                 example: MT-03
 *               year:
 *                 type: integer
 *                 example: 2025
 *               licensePlate:
 *                 type: string
 *                 example: ABC123
 *               dailyRate:
 *                 type: number
 *                 example: 90000
 *               displacement:
 *                 type: number
 *                 example: 321
 *               color:
 *                 type: string
 *                 example: Negro
 *               KM:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Moto registrada correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Sin permisos suficientes
 *       500:
 *         description: Error interno del servidor
 */

router.post("/create/moto", verificarToken, verificarPerfil('OWNER'), createMoto);

export default router;