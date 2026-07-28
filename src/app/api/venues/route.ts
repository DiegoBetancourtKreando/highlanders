// ============================================================
// API de sedes
// ============================================================

import { catalogService } from "@/services/catalog.service";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const venues = await catalogService.getVenues();
    return apiSuccess(venues);
  } catch (error) {
    return apiError("Error al cargar sedes", 500);
  }
}
