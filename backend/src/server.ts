// Se agrega la extensión .js a la ruta relativa hacia app
import app from './app.js';

// Tomar el puerto configurado en .env o asignar el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Encender el servidor HTTP para escuchar conexiones entrantes
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});