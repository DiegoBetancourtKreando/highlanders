// ============================================================
// SERVICIO DE CATÁLOGOS
// ============================================================

import { prisma } from "@/lib/prisma";

export const catalogService = {
  /**
   * Obtiene todas las categorías
   */
  async getCategories() {
    return prisma.category.findMany({
      orderBy: { order: "asc" },
    });
  },

  /**
   * Obtiene todas las sedes
   */
  async getVenues() {
    return prisma.venue.findMany({
      orderBy: { order: "asc" },
    });
  },

  /**
   * Obtiene todos los tipos de uniforme
   */
  async getUniformTypes() {
    return prisma.uniformType.findMany();
  },

  /**
   * Obtiene todos los estilos de uniforme
   */
  async getUniformStyles() {
    return prisma.uniformStyle.findMany();
  },

  /**
   * Obtiene todas las tallas
   */
  async getUniformSizes() {
    return prisma.uniformSize.findMany({
      orderBy: { order: "asc" },
    });
  },

  /**
   * Obtiene todas las posiciones
   */
  async getPositions() {
    return prisma.position.findMany();
  },

  /**
   * Obtiene todos los catálogos en una sola llamada
   */
  async getAll() {
    const [categories, venues, uniformTypes, uniformStyles, uniformSizes, positions] =
      await Promise.all([
        this.getCategories(),
        this.getVenues(),
        this.getUniformTypes(),
        this.getUniformStyles(),
        this.getUniformSizes(),
        this.getPositions(),
      ]);

    return {
      categories,
      venues,
      uniformTypes,
      uniformStyles,
      uniformSizes,
      positions,
    };
  },
};
