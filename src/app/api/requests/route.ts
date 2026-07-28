import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/utils";

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
