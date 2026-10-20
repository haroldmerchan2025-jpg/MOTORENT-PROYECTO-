import { test } from "node:test";
import assert from "node:assert";
import { calcularEstadisticasDashboard } from "../services/dashboard.service.js";

test("calcularEstadisticasDashboard debe fallar si el usuario no existe", async () => {
  // Probamos que al pasar un ID inexistente, el servicio lance el error esperado
  await assert.rejects(
    async () => {
      await calcularEstadisticasDashboard("usuario_inexistente_123");
    },
    {
      message: "Usuario no encontrado",
    }
  );
});
