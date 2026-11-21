import { Router } from "express";
import { verificarToken } from "../middleware/auth.middleware.js";
import {
  listarClausulas, crearRenta, firmarContrato, reportarIncidente,
} from "../controllers/renta.controller.js";

const router = Router();

router.get("/clausulas", listarClausulas);
router.post("/rentas", verificarToken, crearRenta);
router.post("/rentas/:id/contrato/firmar", verificarToken, firmarContrato);
router.post("/rentas/:id/incidente", verificarToken, reportarIncidente);

export default router;
