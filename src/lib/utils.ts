import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================
// UTILIDADES GENERALES
// ============================================================

/**
 * Combina clases de Tailwind de forma inteligente,
 * resolviendo conflictos entre clases
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convierte una fecha serial de Excel a Date de JavaScript
 */
export function excelSerialToDate(serial: number): Date {
  return new Date((serial - 25569) * 86400 * 1000);
}

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Genera un número de ticket único
 * Formato: REQ-{YYYY}-{XXXXX}
 */
export function generateTicket(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `REQ-${year}-${random}`;
}

/**
 * Slugifica un texto (lo convierte a URL-friendly)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Formatea una respuesta de API exitosa
 */
export function apiSuccess<T>(data: T) {
  return Response.json({ success: true, data });
}

/**
 * Formatea una respuesta de API con error
 */
export function apiError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

/**
 * Obtiene la edad a partir de una fecha de nacimiento
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
