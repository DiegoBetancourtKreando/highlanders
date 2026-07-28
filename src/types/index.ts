// ============================================================
// TIPOS COMPARTIDOS DEL SISTEMA
// ============================================================

// Re-exportar tipos de Zod
export type {
  UniformFormData,
  ValidateNumberRequest,
  ValidateNumberResponse,
  LoginData,
} from "@/lib/validations";

// Tipos de estado
export type PlayerStatus = "Activo" | "Pasivo";
export type RequestStatus = "Pendiente" | "Aprobada" | "Rechazada" | "Entregada";
export type AdminRole = "admin" | "superadmin";
export type ImportStatus = "Completado" | "Parcial" | "Fallido";

// Tipo para resultados de importación
export interface ImportResult {
  totalRows: number;
  successRows: number;
  errorRows: number;
  errors: Array<{ row: number; message: string }>;
}

// Tipo para opciones de select/combobox
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Tipo para respuesta de paginación
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Tipo para estadísticas del dashboard
export interface DashboardStats {
  totalPlayers: number;
  activePlayers: number;
  totalRequests: number;
  pendingRequests: number;
  playersByCategory: Array<{ category: string; count: number }>;
  playersByVenue: Array<{ venue: string; count: number }>;
  requestsByStatus: Array<{ status: string; count: number }>;
}

// Tipo para filtros de búsqueda de jugadores
export interface PlayerFilters {
  search?: string;
  categoryId?: string;
  venueId?: string;
  status?: PlayerStatus;
  page?: number;
  pageSize?: number;
}
