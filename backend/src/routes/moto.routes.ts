import {Router} from 'express';
import {obtenerMotos, crearMoto} from '../controllers/moto.controller';
import {verificarToken} from '../middleware/auth.middleware';

const router = Router();

router.get('/motos', obtenerMotos);
router.post('/motos', verificarToken, crearMoto);

export default router;
