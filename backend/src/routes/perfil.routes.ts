import { Router } from "express";
import { verificarToken } from "../middleware/auth.middleware.js";
import { verificarAdmin } from "../middleware/validateProfileAdmin.js";
import {
  solicitarPerfilOwner,
  solicitarPerfilRenter,
  ObtenerSolicitudesOwnerController,
  AprobarSolicitudOwnerController,
  RechazarSolicitudOwnerController,
  ObtenerSolicitudesRenterController,
  AprobarSolicitudRenterController,
  RechazarSolicitudRenterController,
} from "../controllers/perfil.controller.js";

const router = Router();

// Solicitar perfil OWNER y RENTER
router.post("/owner", verificarToken, solicitarPerfilOwner);
router.post("/renter", verificarToken, solicitarPerfilRenter);

// Consultar solicitudes OWNER y RENTER (Admin)
router.get(
  "/solicitudes/owner",
  verificarToken,
  verificarAdmin,
  ObtenerSolicitudesOwnerController
);

router.get(
  "/solicitudes/renter",
  verificarToken,
  verificarAdmin,
  ObtenerSolicitudesRenterController
);

// Aprobar solicitud OWNER y RENTER (Admin)
router.patch(
  "/aprobar/owner/:id",
  verificarToken,
  verificarAdmin,
  AprobarSolicitudOwnerController
);

router.patch(
  "/aprobar/renter/:id",
  verificarToken,
  verificarAdmin,
  AprobarSolicitudRenterController
);

// Rechazar solicitud OWNER y RENTER (Admin)
router.patch(
  "/rechazar/owner/:id",
  verificarToken,
  verificarAdmin,
  RechazarSolicitudOwnerController
);

router.patch(
  "/rechazar/renter/:id",
  verificarToken,
  verificarAdmin,
  RechazarSolicitudRenterController
);

export default router;
