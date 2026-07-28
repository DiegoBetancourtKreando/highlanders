// ============================================================
// SERVICIO DE VALIDACIÓN
// ============================================================

import { prisma } from "@/lib/prisma";
import type { ValidateNumberResponse } from "@/lib/validations";

export const validationService = {
  /**
   * Valida si un número de camiseta está disponible
   * Regla de negocio: la combinación Número + Categoría + Sede debe ser única
   */
  async validateJerseyNumber(
    jerseyNumber: string,
    categoryId: string,
    venueId: string,
    excludePlayerId?: string
  ): Promise<ValidateNumberResponse> {
    // 1. Validar formato del número
    const num = parseInt(jerseyNumber, 10);
    if (isNaN(num) || num < 1 || num > 99) {
      return {
        available: false,
        message: "El número debe estar entre 1 y 99",
      };
    }

    // 2. Buscar jugador activo con misma combinación
    const existingPlayer = await prisma.player.findFirst({
      where: {
        jerseyNumber,
        categoryId,
        venueId,
        status: "Activo",
        ...(excludePlayerId ? { id: { not: excludePlayerId } } : {}),
      },
      select: {
        fullName: true,
        jerseyNumber: true,
        category: { select: { name: true } },
        venue: { select: { name: true } },
      },
    });

    if (existingPlayer) {
      return {
        available: false,
        message: `El número ${jerseyNumber} ya está asignado. Por favor, elige otro número.`,
        playerName: existingPlayer.fullName,
      };
    }

    // 3. Verificar también en solicitudes pendientes
    const existingRequest = await prisma.uniformRequest.findFirst({
      where: {
        jerseyNumber,
        categoryId,
        venueId,
        status: { in: ["Pendiente", "Aprobada"] },
      },
      select: { playerFullName: true },
    });

    if (existingRequest) {
      return {
        available: false,
        message: `El número ${jerseyNumber} ya fue solicitado. Por favor, elige otro número.`,
        playerName: existingRequest.playerFullName,
      };
    }

    // 4. Número disponible
    return {
      available: true,
      message: `¡El número ${jerseyNumber} está disponible!`,
    };
  },

  /**
   * Valida datos completos del formulario (para Server Action)
   */
  validateFormData(data: Record<string, unknown>) {
    const errors: Record<string, string> = {};

    if (!data.playerFullName || String(data.playerFullName).length < 3) {
      errors.playerFullName = "El nombre completo es obligatorio (mín. 3 caracteres)";
    }

    if (!data.uniformName || String(data.uniformName).length < 1) {
      errors.uniformName = "El nombre en la camiseta es obligatorio";
    }

    if (!data.jerseyNumber || !/^\d+$/.test(String(data.jerseyNumber))) {
      errors.jerseyNumber = "El número de camiseta es obligatorio y debe ser numérico";
    }

    if (!data.categoryId) {
      errors.categoryId = "Selecciona una categoría";
    }

    if (!data.venueId) {
      errors.venueId = "Selecciona una sede";
    }

    if (!data.uniformTypeIds || !Array.isArray(data.uniformTypeIds) || data.uniformTypeIds.length === 0) {
      errors.uniformTypeIds = "Selecciona al menos un tipo de prenda";
    }

    if (!data.size || String(data.size).length < 1) {
      errors.size = "La talla es obligatoria";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
