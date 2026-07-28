import { NextRequest } from "next/server";
import { playerService } from "@/services/player.service";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (query.length < 2) {
      return apiSuccess([]);
    }

    const results = await playerService.search(query, limit);
    return apiSuccess(results);
  } catch (error) {
    console.error("Error searching players:", error);
    return apiError("Error al buscar jugadores", 500);
  }
}
