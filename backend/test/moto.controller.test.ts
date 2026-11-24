import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { prisma } from "../src/config/prisma.js";
import { createMoto } from "../src/controllers/moto.controller.js";

test("createMoto responde 201 cuando el registro es exitoso", async () => {
  // 1. Aislamiento estricto de la base de datos:
  // Se preservan los métodos originales de Prisma para garantizar que se puedan restaurar.
  const originalFindFirst = prisma.moto.findFirst;
  const originalFindUniqueOwner = prisma.owner.findUnique;
  const originalCreateMoto = prisma.moto.create;

  // Se sustituyen las funciones de persistencia por mocks controlados en memoria.
  // mockFindFirst simula que la placa NO existe previamente (retorna null).
  const mockFindFirst = mock.fn(async () => null);

  // mockFindOwner simula que el usuario ya cuenta con un perfil de Owner registrado.
  const mockFindOwner = mock.fn(async () => ({
    id: "owner-uuid-456",
    userId: "user-123",
  }));

  // mockCreateMoto intercepta la escritura en PostgreSQL y devuelve el objeto simulado con su id generado.
  const mockCreateMoto = mock.fn(async (args: any) => ({
    id: "moto-uuid-789",
    ...args.data,
    status: "PENDING_APPROVAL",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  prisma.moto.findFirst = mockFindFirst as any;
  prisma.owner.findUnique = mockFindOwner as any;
  prisma.moto.create = mockCreateMoto as any;

  try {
    // 2. Construcción de objetos simulados req y res adaptados al controlador real
    const req: any = {
      usuario: {
        id: "user-123",
      },
      body: {
        brand: "Yamaha",
        model: "MT-03",
        year: 2022,
        licensePlate: "ABC12D",
        dailyRate: 150000,
        displacement: 321,
        color: "Negro",
        KM: 12000,
      },
    };

    const res: any = {
      statusCode: 0,
      body: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(payload: any) {
        this.body = payload;
        return this;
      },
    };

    // 3. Ejecución de la unidad bajo prueba (Controlador)
    await createMoto(req, res);

    // 4. Verificación de aserciones contractuales

    // Aserción 1: El código HTTP es 201 Created
    assert.strictEqual(
      res.statusCode,
      201,
      "El código de estado HTTP debe ser 201"
    );

    // Aserción 2: La respuesta contiene el indicador de éxito que utiliza el proyecto
    assert.strictEqual(
      res.body?.status,
      "success",
      "El indicador de estado debe ser 'success'"
    );
    assert.strictEqual(
      res.body?.mensaje,
      "Motocicleta registrada con éxito",
      "El mensaje debe coincidir con el contrato"
    );

    // Aserción 3: La respuesta incluye los datos de la motocicleta simulada, incluido su identificador
    assert.ok(res.body?.data, "La propiedad 'data' debe estar presente en el cuerpo");
    assert.strictEqual(
      res.body.data.id,
      "moto-uuid-789",
      "El identificador generado debe retornar en la respuesta"
    );
    assert.strictEqual(res.body.data.brand, "Yamaha");
    assert.strictEqual(res.body.data.model, "MT-03");
    assert.strictEqual(res.body.data.licensePlate, "ABC12D");
    assert.strictEqual(res.body.data.ownerId, "owner-uuid-456");

    // Aserción 4: La dependencia simulada fue utilizada (comprobación de aislamiento y llamada efectiva)
    assert.strictEqual(
      mockFindFirst.mock.calls.length,
      1,
      "Debe haberse consultado la existencia previa de la placa"
    );
    assert.strictEqual(
      mockFindOwner.mock.calls.length,
      1,
      "Debe haberse verificado el perfil de Owner del usuario"
    );
    assert.strictEqual(
      mockCreateMoto.mock.calls.length,
      1,
      "La función de persistencia prisma.moto.create debe haberse llamado exactamente una vez"
    );

    // Verificación de los argumentos exactos pasados a la capa de datos
    const createArgs = mockCreateMoto.mock.calls[0]?.arguments[0];
    assert.strictEqual(createArgs?.data?.brand, "Yamaha");
    assert.strictEqual(createArgs?.data?.licensePlate, "ABC12D");
    assert.strictEqual(createArgs?.data?.ownerId, "owner-uuid-456");

  } finally {
    // 5. Limpieza y restauración para evitar efectos colaterales entre pruebas
    prisma.moto.findFirst = originalFindFirst;
    prisma.owner.findUnique = originalFindUniqueOwner;
    prisma.moto.create = originalCreateMoto;
    await prisma.$disconnect();
  }
});
