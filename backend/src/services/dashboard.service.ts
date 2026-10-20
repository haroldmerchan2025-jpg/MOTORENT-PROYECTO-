import * as dashboardRepo from "../repositories/dashboard.repository.js";
export const calcularEstadisticasDashboard = async (userId: string) => {
  // 1. Le pide al Repositorio el usuario
  const user = await dashboardRepo.obtenerUsuarioConPerfiles(userId);
  if (!user) throw new Error("Usuario no encontrado");
  let rentasComoCliente = 0;
  let rentaActiva = null;
  let proximaDevolucion = "--";
  // 2. Lógica si es Cliente (Cálculos de días restantes y fechas)
  if (user.client) {
    rentasComoCliente = await dashboardRepo.obtenerRentasCliente(user.client.id);
    
    const activeRental = await dashboardRepo.obtenerRentaActivaCliente(user.client.id);
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
  // 3. Lógica si es Dueño (Cálculo de ganancias del mes)
  let motosPublicadas = 0;
  let gananciasDelMes = 0;
  if (user.owner) {
    motosPublicadas = await dashboardRepo.obtenerMotosPublicadasPropietario(user.owner.id);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const rentasDelMes = await dashboardRepo.obtenerRentasDelMesPropietario(user.owner.id, startOfMonth);
    // El Chef hace la suma matemática:
    gananciasDelMes = rentasDelMes.reduce((acc, curr) => acc + Number(curr.ownerEarnings), 0);
  }
  // Devuelve el objeto procesado y limpio
  return {
    estadisticas: {
      rentasComoCliente,
      motosPublicadas,
      gananciasDelMes,
      proximaDevolucion,
    },
    rentaActiva,
  };
};