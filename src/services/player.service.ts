// ============================================================
// SERVICIO DE JUGADORES
// ============================================================

import { prisma } from "@/lib/prisma";
import type { PlayerFilters, PaginatedResponse, SelectOption } from "@/types";
import { Prisma } from "@prisma/client";

// Tipo de retorno para listados (evitando datos sensibles)
const playerBasicSelect = {
  id: true,
  code: true,
  fullName: true,
  preferredName: true,
  uniformName: true,
  jerseyNumber: true,
  status: true,
  gender: true,
  category: { select: { id: true, name: true } },
  venue: { select: { id: true, name: true } },
  createdAt: true,
} as const;

// Tipo manual porque Prisma.PlayerGetPayload no está exportado en Prisma v5
export interface PlayerBasic {
  id: string;
  code: number;
  fullName: string;
  preferredName: string | null;
  uniformName: string | null;
  jerseyNumber: string | null;
  status: string;
  gender: string | null;
  category: { id: string; name: string };
  venue: { id: string; name: string };
  createdAt: Date;
}

export const playerService = {
  /**
   * Lista jugadores con filtros y paginación
   */
  async list(filters: PlayerFilters): Promise<PaginatedResponse<PlayerBasic>> {
    const {
      search,
      categoryId,
      venueId,
      status,
      page = 1,
      pageSize = 20,
    } = filters;

    const where: Prisma.PlayerWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { preferredName: { contains: search, mode: "insensitive" } },
        { code: isNaN(Number(search)) ? undefined : Number(search) },
      ].filter(Boolean) as Prisma.PlayerWhereInput[];
    }

    if (categoryId) where.categoryId = categoryId;
    if (venueId) where.venueId = venueId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.player.findMany({
        where,
        select: playerBasicSelect,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { code: "asc" },
      }),
      prisma.player.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /**
   * Obtiene un jugador por ID con todos los detalles
   */
  async getById(id: string) {
    return prisma.player.findUnique({
      where: { id },
      include: {
        category: true,
        venue: true,
        registeredPosition: true,
        assignedPosition: true,
        uniformRequests: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  },

  /**
   * Busca jugadores para autocompletado
   */
  async search(query: string, limit = 10): Promise<SelectOption[]> {
    const players = await prisma.player.findMany({
      where: {
        status: "Activo",
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { preferredName: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        code: true,
        jerseyNumber: true,
        category: { select: { name: true } },
        venue: { select: { name: true } },
      },
      take: limit,
      orderBy: { fullName: "asc" },
    });

    return players.map((p) => ({
      value: p.id,
      label: `${p.fullName} (Cód: ${p.code}) - #${p.jerseyNumber || "N/A"} - ${p.category.name} - ${p.venue.name}`,
    }));
  },

  /**
   * Verifica si un número está disponible para una categoría y sede
   */
  async isJerseyNumberAvailable(
    jerseyNumber: string,
    categoryId: string,
    venueId: string,
    excludePlayerId?: string
  ): Promise<{ available: boolean; existingPlayerName?: string }> {
    const where: Prisma.PlayerWhereInput = {
      jerseyNumber,
      categoryId,
      venueId,
      status: "Activo",
    };

    if (excludePlayerId) {
      where.id = { not: excludePlayerId };
    }

    const existingPlayer = await prisma.player.findFirst({
      where,
      select: { id: true, fullName: true, jerseyNumber: true },
    });

    if (existingPlayer) {
      return {
        available: false,
        existingPlayerName: existingPlayer.fullName,
      };
    }

    // También verificar en solicitudes pendientes/aprobadas
    const existingRequest = await prisma.uniformRequest.findFirst({
      where: {
        jerseyNumber,
        categoryId,
        venueId,
        status: { in: ["Pendiente", "Aprobada"] },
      },
      select: { id: true },
    });

    if (existingRequest) {
      return {
        available: false,
        existingPlayerName: "Solicitud pendiente",
      };
    }

    return { available: true };
  },

  /**
   * Obtiene estadísticas de jugadores
   */
  async getStats() {
    const [totalPlayers, activePlayers, byCategory, byVenue] =
      await Promise.all([
        prisma.player.count(),
        prisma.player.count({ where: { status: "Activo" } }),
        prisma.player.groupBy({
          by: ["categoryId"],
          where: { status: "Activo" },
          _count: { id: true },
        }),
        prisma.player.groupBy({
          by: ["venueId"],
          where: { status: "Activo" },
          _count: { id: true },
        }),
      ]);

    // Obtener nombres de categorías y sedes
    const categoryIds = byCategory.map((c) => c.categoryId);
    const venueIds = byVenue.map((v) => v.venueId);

    const [categories, venues] = await Promise.all([
      prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true },
      }),
      prisma.venue.findMany({
        where: { id: { in: venueIds } },
        select: { id: true, name: true },
      }),
    ]);

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const venueMap = new Map(venues.map((v) => [v.id, v.name]));

    return {
      totalPlayers,
      activePlayers,
      playersByCategory: byCategory.map((c) => ({
        category: categoryMap.get(c.categoryId) || c.categoryId,
        count: c._count.id,
      })),
      playersByVenue: byVenue.map((v) => ({
        venue: venueMap.get(v.venueId) || v.venueId,
        count: v._count.id,
      })),
    };
  },
};
