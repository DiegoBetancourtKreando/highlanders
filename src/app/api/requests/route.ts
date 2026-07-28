import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/utils";
import { excelSerialToDate } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authService.authenticateRequest(request);
    if (!auth.authenticated) {
      return apiError("No autorizado", 401);
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return apiError("Faltan datos requeridos", 400);
    }

    const validStatuses = ["Pendiente", "Aprobada", "Rechazada", "Entregada"];
    if (!validStatuses.includes(status)) {
      return apiError("Estado inválido", 400);
    }

    // Si se aprueba, crear un jugador automáticamente
    if (status === "Aprobada") {
      const requestData = await prisma.uniformRequest.findUnique({
        where: { id },
        select: {
          playerFullName: true,
          uniformName: true,
          jerseyNumber: true,
          categoryId: true,
          venueId: true,
        },
      });

      if (!requestData) {
        return apiError("Solicitud no encontrada", 404);
      }

      // Verificar si ya existe un jugador con ese nombre para no duplicar
      const existingPlayer = await prisma.player.findFirst({
        where: {
          fullName: requestData.playerFullName,
          categoryId: requestData.categoryId,
          venueId: requestData.venueId,
        },
      });

      if (!existingPlayer) {
        // Obtener el código más alto para asignar uno nuevo
        const maxCode = await prisma.player.findFirst({
          orderBy: { code: "desc" },
          select: { code: true },
        });
        const newCode = (maxCode?.code || 0) + 1;

        const newPlayer = await prisma.player.create({
          data: {
            code: newCode,
            fullName: requestData.playerFullName,
            uniformName: requestData.uniformName || undefined,
            jerseyNumber: requestData.jerseyNumber || undefined,
            status: "Activo",
            categoryId: requestData.categoryId,
            venueId: requestData.venueId,
          },
        });

        // Asociar la solicitud con el jugador creado
        await prisma.uniformRequest.update({
          where: { id },
          data: { playerId: newPlayer.id },
        });
      } else {
        // Si ya existe, asociar la solicitud con ese jugador
        await prisma.uniformRequest.update({
          where: { id },
          data: { playerId: existingPlayer.id },
        });
      }
    }

    const updated = await prisma.uniformRequest.update({
      where: { id },
      data: { status },
      select: { id: true, ticket: true, status: true },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("Error updating request:", error);
    return apiError("Error al actualizar solicitud", 500);
  }
}
