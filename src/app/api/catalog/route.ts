import { NextRequest } from "next/server";
import { catalogService } from "@/services/catalog.service";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(_request: NextRequest) {
  try {
    const catalogs = await catalogService.getAll();
    return apiSuccess(catalogs);
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return apiError("Error al cargar catálogos", 500);
  }
}
