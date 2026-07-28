// ============================================================
// SERVICIO DE IMPORTACIÓN DE DATOS
// ============================================================

import { prisma } from "@/lib/prisma";
import { excelSerialToDate, slugify } from "@/lib/utils";
import type { ImportResult } from "@/types";
import * as XLSX from "xlsx";

// Tipos internos del Excel
interface ExcelPlayerRow {
  codigo: number;
  nombreCompleto: string;
  nombreUso: string;
  nombreUniforme: string;
  numero: string;
  posicionRegistrada: string;
  posicionAsignada: string;
  grupo: string;
  nivel: number;
  fechaIngreso: number | string; // Serial Excel
  antiguedad: string;
  genero: string;
  fechaNacimiento: number | string; // Serial Excel
  categoria: string;
  estado: string;
  ciudad: string;
  zonaGeografica: string;
  sede: string;
  modelo: string;
  diasAsistencia: string;
  franjaHoraria: string;
}

export const importService = {
  /**
   * Procesa el archivo Excel y extrae los jugadores de la hoja Matriz
   */
  async parseExcelFile(filePath: string): Promise<ExcelPlayerRow[]> {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["Matriz"];

    if (!sheet) {
      throw new Error("No se encontró la hoja 'Matriz' en el archivo Excel");
    }

    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const players: ExcelPlayerRow[] = [];

    // La fila 0 y 1 son encabezados, datos desde fila 2
    for (let i = 2; i < rawData.length; i++) {
      const row = rawData[i] as Array<string | number>;
      const codigo = row[1];

      // Saltar filas vacías o sin código
      if (!codigo || String(codigo).trim() === "" || String(codigo).trim() === "CÓDIGO") {
        continue;
      }

      players.push({
        codigo: Number(codigo),
        nombreCompleto: String(row[2] || "").trim(),
        nombreUso: String(row[3] || "").trim(),
        nombreUniforme: String(row[4] || "").trim(),
        numero: String(row[5] || "").trim(),
        posicionRegistrada: String(row[6] || "").trim(),
        posicionAsignada: String(row[7] || "").trim(),
        grupo: String(row[8] || "").trim(),
        nivel: row[9] ? Number(row[9]) : 0,
        fechaIngreso: row[10],
        antiguedad: String(row[11] || "").trim(),
        genero: String(row[13] || "").trim(),
        fechaNacimiento: row[14],
        categoria: String(row[15] || "").trim(),
        estado: String(row[16] || "Activo").trim(),
        ciudad: String(row[17] || "").trim(),
        zonaGeografica: String(row[18] || "").trim(),
        sede: String(row[19] || "").trim(),
        modelo: String(row[20] || "").trim(),
        diasAsistencia: String(row[21] || "").trim(),
        franjaHoraria: String(row[22] || "").trim(),
      });
    }

    return players;
  },

  /**
   * Importa jugadores desde el Excel a la base de datos
   * Es idempotente: si un jugador ya existe (por código), lo actualiza
   */
  async importFromExcel(filePath: string): Promise<ImportResult> {
    const errors: Array<{ row: number; message: string }> = [];
    let successCount = 0;

    const players = await this.parseExcelFile(filePath);

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      try {
        // Obtener o crear categoría
        const category = await this.getOrCreateCategory(player.categoria);

        // Obtener o crear sede
        const venue = await this.getOrCreateVenue(player.sede);

        // Obtener o crear posiciones
        const registeredPosId = player.posicionRegistrada
          ? (await this.getOrCreatePosition(player.posicionRegistrada)).id
          : undefined;

        const assignedPosId = player.posicionAsignada
          ? (await this.getOrCreatePosition(player.posicionAsignada)).id
          : undefined;

        // Convertir fechas
        const birthDate =
          typeof player.fechaNacimiento === "number"
            ? excelSerialToDate(player.fechaNacimiento)
            : undefined;

        const dateOfEntry =
          typeof player.fechaIngreso === "number"
            ? excelSerialToDate(player.fechaIngreso)
            : undefined;

        // Upsert: crear o actualizar jugador
        await prisma.player.upsert({
          where: { code: player.codigo },
          update: {
            fullName: player.nombreCompleto,
            preferredName: player.nombreUso || undefined,
            uniformName: player.nombreUniforme || undefined,
            jerseyNumber: player.numero || undefined,
            gender: player.genero || undefined,
            birthDate: birthDate || undefined,
            dateOfEntry: dateOfEntry || undefined,
            seniority: player.antiguedad || undefined,
            status: player.estado,
            city: player.ciudad || undefined,
            geographicZone: player.zonaGeografica || undefined,
            modelType: player.modelo || undefined,
            daysOfAttendance: player.diasAsistencia || undefined,
            timeSlot: player.franjaHoraria || undefined,
            group: player.grupo || undefined,
            level: player.nivel || undefined,
            categoryId: category.id,
            venueId: venue.id,
            registeredPositionId: registeredPosId || undefined,
            assignedPositionId: assignedPosId || undefined,
          },
          create: {
            code: player.codigo,
            fullName: player.nombreCompleto,
            preferredName: player.nombreUso || undefined,
            uniformName: player.nombreUniforme || undefined,
            jerseyNumber: player.numero || undefined,
            gender: player.genero || undefined,
            birthDate: birthDate || undefined,
            dateOfEntry: dateOfEntry || undefined,
            seniority: player.antiguedad || undefined,
            status: player.estado,
            city: player.ciudad || undefined,
            geographicZone: player.zonaGeografica || undefined,
            modelType: player.modelo || undefined,
            daysOfAttendance: player.diasAsistencia || undefined,
            timeSlot: player.franjaHoraria || undefined,
            group: player.grupo || undefined,
            level: player.nivel || undefined,
            categoryId: category.id,
            venueId: venue.id,
            registeredPositionId: registeredPosId || undefined,
            assignedPositionId: assignedPosId || undefined,
          },
        });

        successCount++;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        errors.push({ row: i + 1, message });
      }
    }

    return {
      totalRows: players.length,
      successRows: successCount,
      errorRows: errors.length,
      errors,
    };
  },

  /**
   * Obtiene o crea una categoría
   */
  async getOrCreateCategory(name: string) {
    const slug = slugify(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return existing;

    return prisma.category.create({
      data: { name, slug },
    });
  },

  /**
   * Obtiene o crea una sede
   */
  async getOrCreateVenue(name: string) {
    const slug = slugify(name);
    const existing = await prisma.venue.findUnique({ where: { slug } });
    if (existing) return existing;

    return prisma.venue.create({
      data: { name, slug },
    });
  },

  /**
   * Obtiene o crea una posición
   */
  async getOrCreatePosition(names: string) {
    // Las posiciones pueden venir como "GK, DF, MF, WG, FW"
    // Tomamos la primera como principal
    const primaryName = names.split(",")[0].trim();
    const slug = slugify(primaryName);

    const existing = await prisma.position.findUnique({ where: { slug } });
    if (existing) return existing;

    return prisma.position.create({
      data: {
        name: primaryName,
        slug,
        fullName: primaryName,
      },
    });
  },
};
