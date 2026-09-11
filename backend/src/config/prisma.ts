import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Cargar variables de entorno para acceder a DATABASE_URL
dotenv.config();

// Crear el adaptador de driver para PostgreSQL en Prisma 7
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Instanciar y exportar el cliente de Prisma utilizando el adaptador
export const prisma = new PrismaClient({ adapter });