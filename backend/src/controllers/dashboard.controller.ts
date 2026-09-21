import type { Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.usuario?.id;
    
    if (!userId) {
      res.status(401).json({ ok: false, mensaje: "No autorizado" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
        owner: true,
      },
    });

    if (!user) {
      res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
      return;
    }

    let rentasComoCliente = 0;
    let rentaActiva = null;
    let proximaDevolucion = "--";

    if (user.client) {
      rentasComoCliente = await prisma.rental.count({
        where: { clientId: user.client.id }
      });

      const activeRental = await prisma.rental.findFirst({
        where: { clientId: user.client.id, status: "ACTIVE" },
        include: { moto: true },
        orderBy: { endDate: "asc" }
      });

      if (activeRental) {
        const endDate = new Date(activeRental.endDate);
        const hoy = new Date();
        const diffTime = endDate.getTime() - hoy.getTime();
        const diasRestantes = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        
        proximaDevolucion = endDate.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
        
        rentaActiva = {
          moto: `${activeRental.moto.brand} ${activeRental.moto.model}`,
          fechaDevolucion: endDate.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
          diasRestantes,
          tarifaDiaria: Number(activeRental.moto.dailyRate),
        };
      }
    }

    let motosPublicadas = 0;
    let gananciasDelMes = 0;

    if (user.owner) {
      motosPublicadas = await prisma.moto.count({
        where: { ownerId: user.owner.id }
      });

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const rentasDelMes = await prisma.rental.findMany({
        where: {
          moto: { ownerId: user.owner.id },
          startDate: { gte: startOfMonth },
          status: { in: ["COMPLETED", "ACTIVE"] }
        },
        select: { ownerEarnings: true }
      });

      gananciasDelMes = rentasDelMes.reduce((acc, curr) => acc + Number(curr.ownerEarnings), 0);
    }

    res.json({
      ok: true,
      estadisticas: {
        rentasComoCliente,
        motosPublicadas,
        gananciasDelMes,
        proximaDevolucion,
      },
      rentaActiva,
    });

  } catch (error) {
    console.error("Error obteniendo estadísticas del dashboard:", error);
    res.status(500).json({ ok: false, mensaje: "Error interno del servidor al cargar el dashboard." });
  }
};
