// ============================================================
// SERVICIO DE SOLICITUDES DE UNIFORME
// ============================================================

import { prisma } from "@/lib/prisma";
import { generateTicket } from "@/lib/utils";
import type { UniformFormData } from "@/lib/validations";
import type { PaginatedResponse, RequestStatus } from "@/types";

const requestBasicSelect = {
  id: true,
  ticket: true,
  playerFullName: true,
  uniformName: true,
  jerseyNumber: true,
  status: true,
  category: { select: { id: true, name: true } },
  venue: { select: { id: true, name: true } },
  createdAt: true,
} as const;

// Tipo manual porque Prisma.UniformRequestGetPayload no está exportado en Prisma v5
export interface UniformRequestBasic {
  id: string;
  ticket: string;
  playerFullName: string;
  uniformName: string;
  jerseyNumber: string;
  status: string;
  category: { id: string; name: string };
  venue: { id: string; name: string };
  createdAt: Date;
}

export const uniformRequestService = {
  /**
   * Crea una nueva solicitud de uniforme
   */
  async create(data: UniformFormData) {
    const ticket = generateTicket();

    return prisma.uniformRequest.create({
      data: {
        ticket,
        playerFullName: data.playerFullName,
        uniformName: data.uniformName,
        nameMeaning: data.nameMeaning,
        jerseyNumber: data.jerseyNumber,
        categoryId: data.categoryId,
        venueId: data.venueId,
        size: data.size,
        celebrationDesc: data.celebrationDesc,
        additionalNotes: data.additionalNotes || null,
        status: "Pendiente",
      },
      select: {
        id: true,
        ticket: true,
        createdAt: true,
      },
    });
  },

  /**
   * Lista solicitudes con filtros y paginación
   */
  async list(filters: {
    search?: string;
    categoryId?: string;
    venueId?: string;
    status?: RequestStatus;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<UniformRequestBasic>> {
    const { search, categoryId, venueId, status, page = 1, pageSize = 20 } = filters;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { playerFullName: { contains: search } },
        { ticket: { contains: search } },
        { uniformName: { contains: search } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (venueId) where.venueId = venueId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.uniformRequest.findMany({
        where,
        select: requestBasicSelect,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.uniformRequest.count({ where }),
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
   * Obtiene una solicitud por ID
   */
  async getById(id: string) {
    return prisma.uniformRequest.findUnique({
      where: { id },
      include: {
        category: true,
        venue: true,
        player: {
          select: {
            id: true,
            fullName: true,
            code: true,
            jerseyNumber: true,
          },
        },
      },
    });
  },

  /**
   * Actualiza el estado de una solicitud
   */
  async updateStatus(id: string, status: RequestStatus, notes?: string) {
    return prisma.uniformRequest.update({
      where: { id },
      data: { status, ...(notes !== undefined ? { notes } : {}) },
    });
  },

  /**
   * Obtiene estadísticas de solicitudes
   */
  async getStats() {
    const [total, byStatus] = await Promise.all([
      prisma.uniformRequest.count(),
      prisma.uniformRequest.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const pending = byStatus.find((s: { status: string }) => s.status === "Pendiente")?._count.id ?? 0;

    return {
      totalRequests: total,
      pendingRequests: pending,
      requestsByStatus: byStatus.map((s: { status: string; _count: { id: number } }) => ({
        status: s.status,
        count: s._count.id,
      })),
    };
  },
};
