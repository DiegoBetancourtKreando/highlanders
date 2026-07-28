import { NextRequest } from "next/server";
import { importService } from "@/services/import.service";
import { authService } from "@/services/auth.service";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";

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

    // Guardar archivo temporal
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(tmpdir(), `import-${uuidv4()}.xlsx`);
    await writeFile(tempFilePath, buffer);

    // Ejecutar importación
    const result = await importService.importFromExcel(tempFilePath);

    // Registrar log de importación
    await prisma.importLog.create({
      data: {
        filename: file.name,
        totalRows: result.totalRows,
        successRows: result.successRows,
        errorRows: result.errorRows,
        errors: JSON.stringify(result.errors),
        status:
          result.errorRows === 0
            ? "Completado"
            : result.successRows > 0
            ? "Parcial"
            : "Fallido",
        adminUserId: auth.user.userId,
        completedAt: new Date(),
      },
    });

    return apiSuccess(result);
  } catch (error) {
    console.error("Error importing file:", error);
    return apiError(
      error instanceof Error ? error.message : "Error al importar archivo",
      500
    );
  }
}
