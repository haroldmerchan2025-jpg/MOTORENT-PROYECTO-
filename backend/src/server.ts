// Se agrega la extensión .js a la ruta relativa hacia app
import app from './app.js';

const rawPort = process.env.PORT ?? 3000;
const port = Number(rawPort);

if(!Number.isInteger(port) || port <= 0 || port > 65535){
    throw new Error(`Ìnvalid port number: ${rawPort} el puerto debe ser un numero positivo entre 1 y 65535 `);
}

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})

const PORT = process.env.PORT || 5000;
// Tomar el puerto configurado en .env o asignar el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Encender el servidor HTTP para escuchar conexiones entrantes
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});