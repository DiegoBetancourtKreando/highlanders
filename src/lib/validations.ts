import { z } from "zod";

// ============================================================
// ESQUEMAS DE VALIDACIÓN (Zod)
// ============================================================

/**
 * Esquema para validación en tiempo real del número de camiseta
 */
export const jerseyNumberSchema = z
  .string()
  .min(1, "El número de camiseta es obligatorio")
  .regex(/^\d+$/, "El número debe contener solo dígitos")
  .refine(
    (val) => {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 99;
    },
    { message: "El número debe estar entre 1 y 99" }
  );

/**
 * Esquema para el nombre completo del jugador
 */
export const playerFullNameSchema = z
  .string()
  .min(3, "El nombre completo debe tener al menos 3 caracteres")
  .max(200, "El nombre completo no puede exceder 200 caracteres");

/**
 * Esquema para el nombre en la camiseta
 */
export const uniformNameSchema = z
  .string()
  .min(1, "El nombre en la camiseta es obligatorio")
  .max(50, "El nombre en la camiseta no puede exceder 50 caracteres");

/**
 * Esquema para el significado/contexto del nombre
 */
export const nameMeaningSchema = z
  .string()
  .min(10, "Explica brevemente el significado (mínimo 10 caracteres)")
  .max(500, "El significado no puede exceder 500 caracteres");

/**
 * Esquema para la descripción de celebración
 */
export const celebrationDescSchema = z
  .string()
  .min(10, "Describe brevemente la celebración (mínimo 10 caracteres)")
  .max(500, "La descripción no puede exceder 500 caracteres");

/**
 * Esquema para notas opcionales
 */
export const additionalNotesSchema = z
  .string()
  .max(500, "Las notas no pueden exceder 500 caracteres")
  .optional()
  .or(z.literal(""));

/**
 * Esquema para talla
 */
export const sizeSchema = z
  .string()
  .min(1, "La talla es obligatoria")
  .max(50, "Talla inválida");

/**
 * Esquema completo del formulario de uniforme
 */
export const uniformFormSchema = z.object({
  playerFullName: playerFullNameSchema,
  uniformName: uniformNameSchema,
  nameMeaning: nameMeaningSchema,
  jerseyNumber: jerseyNumberSchema,
  categoryId: z.string().min(1, "Selecciona una categoría"),
  venueId: z.string().min(1, "Selecciona una sede"),
  uniformTypeIds: z
    .array(z.string())
    .min(1, "Selecciona al menos un tipo de prenda"),
  size: sizeSchema,
  celebrationDesc: celebrationDescSchema,
  additionalNotes: additionalNotesSchema,
});

export type UniformFormData = z.infer<typeof uniformFormSchema>;

/**
 * Esquema para validación en tiempo real de número
 * (llamada AJAX al backend)
 */
export const validateNumberRequestSchema = z.object({
  jerseyNumber: jerseyNumberSchema,
  categoryId: z.string().min(1, "Categoría requerida"),
  venueId: z.string().min(1, "Sede requerida"),
  excludePlayerId: z.string().optional(), // Para edición, excluir al propio jugador
});

export type ValidateNumberRequest = z.infer<typeof validateNumberRequestSchema>;

/**
 * Esquema de respuesta de validación de número
 */
export interface ValidateNumberResponse {
  available: boolean;
  message: string;
  playerName?: string;
}

/**
 * Esquema para login de administrador
 */
export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;
