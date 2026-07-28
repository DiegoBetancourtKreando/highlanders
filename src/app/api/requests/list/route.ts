import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const venueId = searchParams.get("venueId") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { playerFullName: { contains: search, mode: "insensitive" } },
        { ticket: { contains: search } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (venueId) where.venueId = venueId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.uniformRequest.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ticket: true,
          playerFullName: true,
          uniformName: true,
          jerseyNumber: true,
          status: true,
          category: { select: { id: true, name: true } },
          venue: { select: { id: true, name: true } },
          createdAt: true,
        },
      }),
      prisma.uniformRequest.count({ where }),
    ]);

    return apiSuccess({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error listing requests:", error);
    return apiError("Error al listar solicitudes", 500);
  }
}
