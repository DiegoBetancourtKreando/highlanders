import { NextRequest } from "next/server";
import { validationService } from "@/services/validation.service";
import { validateNumberRequestSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

// ============================================================
// API de validación en tiempo real del número de camiseta
// Se llama desde el frontend mediante AJAX mientras el usuario
// llena el formulario.
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const validation = validateNumberRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return apiError(
        Object.values(errors).flat().join(", ") || "Datos inválidos"
      );
    }

    const { jerseyNumber, categoryId, venueId, excludePlayerId } =
      validation.data;

    const result = await validationService.validateJerseyNumber(
      jerseyNumber,
      categoryId,
      venueId,
      excludePlayerId
    );

    return apiSuccess(result);
  } catch (error) {
    console.error("Error validating number:", error);
    return apiError("Error al validar el número", 500);
  }
}
