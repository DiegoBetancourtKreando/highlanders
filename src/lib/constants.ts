// ============================================================
// CONSTANTES DEL DOMINIO
// ============================================================

// Categorías disponibles
export const CATEGORIES = [
  "Sub-4",
  "Sub-5",
  "Sub-6",
  "Sub-7",
  "Sub-8",
  "Sub-9",
  "Sub-10",
  "Sub-11",
  "Sub-12",
  "Sub-13",
  "Sub-14",
  "Sub-16",
  "Sub-22",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

// Sedes disponibles
export const VENUES = [
  "A. La Pampa",
  "B. Carcelén",
  "C. El Portal",
  "D. Pomasqui",
] as const;

export type VenueName = (typeof VENUES)[number];

// Posiciones de juego
export const POSITIONS = [
  { name: "GK", fullName: "Portero" },
  { name: "DF", fullName: "Defensa" },
  { name: "MF", fullName: "Mediocampista" },
  { name: "WG", fullName: "Extremo" },
  { name: "FW", fullName: "Delantero" },
] as const;

// Tipos de uniforme
export const UNIFORM_TYPES = [
  "Uniforme completo",
  "Solo camiseta",
  "Solo pantaloneta",
  "Solo medias",
] as const;

export type UniformTypeName = (typeof UNIFORM_TYPES)[number];

// Estilos de uniforme
export const UNIFORM_STYLES = [
  { name: "Titular (verde con dorado)", color: "Verde con dorado" },
] as const;

// Estados de jugador
export const PLAYER_STATUS = {
  ACTIVE: "Activo",
  INACTIVE: "Pasivo",
} as const;

// Estados de solicitud
export const REQUEST_STATUS = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  DELIVERED: "Entregada",
} as const;

// Roles de administrador
export const ADMIN_ROLES = {
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

// Límites
export const MAX_JERSEY_NUMBER = 99;
export const MIN_JERSEY_NUMBER = 1;

// Zonas geográficas
export const GEOGRAPHIC_ZONES = [
  "1. Norte",
  "2. Sur",
  "3. Este",
  "4. Oeste",
] as const;

// Prefijo para tickets
export const TICKET_PREFIX = "REQ";

// Serial de Excel (fechas)
export const EXCEL_EPOCH_OFFSET = new Date("1899-12-30T00:00:00Z");

// Rutas
export const ROUTES = {
  HOME: "/",
  FORM: "/formulario",
  FORM_SUCCESS: "/formulario/success",
  LOGIN: "/login",
  ADMIN: {
    DASHBOARD: "/dashboard",
    PLAYERS: "/jugadores",
    REQUESTS: "/solicitudes",
    IMPORT: "/importar",
  },
} as const;
