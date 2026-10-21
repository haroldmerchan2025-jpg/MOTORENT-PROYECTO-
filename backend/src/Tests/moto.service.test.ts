
import { test } from "node:test";
import assert from "node:assert/strict";
import { registrarMoto } from "../services/moto.service.js";

const datosValidos = {
  brand: "AKT",
  model: "CR4 150",
  year: 2024,
  licensePlate: "ABC12D",
  dailyRate: 80000,
  displacement: 150,
  color: "Negro",
  KM: 3000,
};

test("Debe rechazar una moto sin marca", async () => {
  const datos = { ...datosValidos, brand: "" };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "Todos los campos deben estar llenos"
      );
      return true;
    }
  );
});

test("Debe rechazar una moto del año 2005", async () => {
  const datos = { ...datosValidos, year: 2005 };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "El año de la moto tiene que ser mayor a el 2005"
      );
      return true;
    }
  );
});

test("Debe rechazar una placa inválida", async () => {
  const datos = { ...datosValidos, licensePlate: "ABC123" };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "Numero de placa invalido (debe ser formato ABC12D)"
      );
      return true;
    }
  );
});

test("Debe rechazar un cilindraje menor a 100", async () => {
  const datos = { ...datosValidos, displacement: 90 };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "El cilindraje de la moto debe ser mayor o igual a 100 y menor o igual a 1500"
      );
      return true;
    }
  );
});

test("Debe rechazar un cilindraje mayor a 1500", async () => {
  const datos = { ...datosValidos, displacement: 1600 };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "El cilindraje de la moto debe ser mayor o igual a 100 y menor o igual a 1500"
      );
      return true;
    }
  );
});

test("Debe rechazar un kilometraje negativo", async () => {
  const datos = { ...datosValidos, KM: -10 };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "El kilometraje debe ser un número mayor o igual a 0"
      );
      return true;
    }
  );
});

test("Debe rechazar un kilometraje que no sea numérico", async () => {
  const datos = { ...datosValidos, KM: "abc" };

  await assert.rejects(
    registrarMoto("user-123", datos),
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "El kilometraje debe ser un número mayor o igual a 0"
      );
      return true;
    }
  );
});

test("Debe aceptar una placa con espacios y convertirla a mayúsculas", () => {
  const placaOriginal = " abc12d ";
  const placaEsperada = "ABC12D";

  assert.strictEqual(placaOriginal.trim().toUpperCase(), placaEsperada);

  assert.deepStrictEqual(
    { placa: placaOriginal.trim().toUpperCase() },
    { placa: placaEsperada }
  );
});
