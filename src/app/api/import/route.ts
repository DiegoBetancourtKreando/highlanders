import { NextRequest } from "next/server";
import { importService } from "@/services/import.service";
import { authService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = await authService.authenticateRequest(request);
    if (!auth.authenticated || !auth.user) {
      return apiError("No autorizado", 401);
    }

    // Obtener archivo del FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No se recibió ningún archivo", 400);
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return apiError("El archivo debe ser .xlsx o .xls", 400);
    }

    // Leer archivo en buffer y procesar directamente en memoria
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ejecutar importación desde buffer (sin escribir a disco)
    const result = await importService.importFromBuffer(
      buffer,
      file.name,
      auth.user.userId
    );

    return apiSuccess(result);
  } catch (error) {
    console.error("Error importing file:", error);
    return apiError(
      error instanceof Error ? error.message : "Error al importar archivo",
      500
    );
  }
}
