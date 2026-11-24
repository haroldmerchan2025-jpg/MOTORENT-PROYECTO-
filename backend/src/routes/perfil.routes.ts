import { Router } from "express";

import { verificarToken } from "../middleware/auth.middleware.js";
import { verificarAdmin } from "../middleware/validateProfileAdmin.js";

import {
  solicitarPerfilOwner,
  ObtenerSolicitudesOwnerController,
  AprobarSolicitudOwnerController,
  RechazarSolicitudOwnerController
} from "../controllers/perfil.controller.js";

const router = Router();

// Solicitar perfil OWNER
router.post(
  "/owner",
  verificarToken,
  solicitarPerfilOwner
);

// Consultar solicitudes OWNER
router.get(
  "/solicitudes/owner",
  verificarToken,
  verificarAdmin,
  ObtenerSolicitudesOwnerController
);

// Aprobar solicitud OWNER
router.patch(
  "/aprobar/owner/:id",
  verificarToken,
  verificarAdmin,
  AprobarSolicitudOwnerController
);

// Rechazar solicitud OWNER
router.patch(
  "/rechazar/owner/:id",
  verificarToken,
  verificarAdmin,
  RechazarSolicitudOwnerController
);

export default router;