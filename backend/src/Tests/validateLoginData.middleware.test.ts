import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { validateLoginData } from "../middleware/validateLoginData.middleware.js";

const mensajeError =
    "Debe proporcionar un usuario o correo y una contraseña válidos";

function ejecutarValidacion(datos: Record<string, unknown>) {
    let statusCode = 0;
    let responseBody: unknown;

    const next = mock.fn();

    const req = {
        body: { ...datos }
    };

    const res = {
        status(code: number) {
            statusCode = code;
            return this;
        },
        json(data: unknown) {
            responseBody = data;
            return this;
        }
    };

    validateLoginData(
        req as any,
        res as any,
        next as any
    );

    return { statusCode, responseBody, next };
}

test("Debe rechazar un identifier vacío", () => {
    const resultado = ejecutarValidacion({
        identifier: "",
        password: "Clave123!"
    });

    assert.strictEqual(resultado.statusCode, 400);
    assert.strictEqual(resultado.next.mock.callCount(), 0);
    assert.deepStrictEqual(resultado.responseBody, {
        ok: false,
        message: mensajeError
    });
});

test("Debe rechazar un identifier con espacios", () => {
    const resultado = ejecutarValidacion({
        identifier: "   ",
        password: "Clave123!"
    });

    assert.strictEqual(resultado.statusCode, 400);
    assert.strictEqual(resultado.next.mock.callCount(), 0);
    assert.deepStrictEqual(resultado.responseBody, {
        ok: false,
        message: mensajeError
    });
});

test("Debe rechazar un identifier que no sea texto", () => {
    const resultado = ejecutarValidacion({
        identifier: 123,
        password: "Clave123!"
    });

    assert.strictEqual(resultado.statusCode, 400);
    assert.strictEqual(resultado.next.mock.callCount(), 0);
    assert.deepStrictEqual(resultado.responseBody, {
        ok: false,
        message: mensajeError
    });
});

test("Debe rechazar una contraseña vacía", () => {
    const resultado = ejecutarValidacion({
        identifier: "usuario123",
        password: ""
    });

    assert.strictEqual(resultado.statusCode, 400);
    assert.strictEqual(resultado.next.mock.callCount(), 0);
    assert.deepStrictEqual(resultado.responseBody, {
        ok: false,
        message: mensajeError
    });
});

test("Debe rechazar una contraseña que no sea texto", () => {
    const resultado = ejecutarValidacion({
        identifier: "usuario123",
        password: 123
    });

    assert.strictEqual(resultado.statusCode, 400);
    assert.strictEqual(resultado.next.mock.callCount(), 0);
    assert.deepStrictEqual(resultado.responseBody, {
        ok: false,
        message: mensajeError
    });
});

test("Debe permitir un identifier y una contraseña válidos", () => {
    const resultado = ejecutarValidacion({
        identifier: "usuario123",
        password: "Clave123!"
    });

    assert.strictEqual(resultado.statusCode, 0);
    assert.strictEqual(resultado.next.mock.callCount(), 1);
    assert.deepStrictEqual(resultado.responseBody, undefined);
});