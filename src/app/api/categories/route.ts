// ============================================================
// API de categorías
// ============================================================

import { catalogService } from "@/services/catalog.service";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await catalogService.getCategories();
    return apiSuccess(categories);
  } catch (error) {
    return apiError("Error al cargar categorías", 500);
  }
}
