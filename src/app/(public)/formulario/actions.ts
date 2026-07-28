// ============================================================
// SERVER ACTION - Envío del formulario de uniforme
// ============================================================

"use server";

import { uniformFormSchema } from "@/lib/validations";
import { uniformRequestService } from "@/services/uniform-request.service";

export async function submitUniformForm(formData: FormData) {
  try {
    // Extraer datos del FormData
    const rawData = {
      playerFullName: formData.get("playerFullName") as string,
      uniformName: formData.get("uniformName") as string,
      nameMeaning: formData.get("nameMeaning") as string,
      jerseyNumber: formData.get("jerseyNumber") as string,
      categoryId: formData.get("categoryId") as string,
      venueId: formData.get("venueId") as string,
      uniformTypeIds: JSON.parse(
        (formData.get("uniformTypeIds") as string) || "[]"
      ),
      uniformStyleId: formData.get("uniformStyleId") as string,
      size: formData.get("size") as string,
      celebrationDesc: formData.get("celebrationDesc") as string,
      additionalNotes: formData.get("additionalNotes") as string,
      agreeToTerms: formData.get("agreeToTerms") === "true",
    };

    // Validar con Zod
    const result = uniformFormSchema.safeParse(rawData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return {
        success: false,
        errors: Object.fromEntries(
          Object.entries(errors).map(([key, msgs]) => [key, msgs?.[0] || ""])
        ),
      };
    }

    // Guardar solicitud
    const request = await uniformRequestService.create(result.data);

    return {
      success: true,
      data: {
        ticket: request.ticket,
        id: request.id,
      },
    };
  } catch (error) {
    console.error("Error al enviar formulario:", error);
    return {
      success: false,
      errors: {
        _form:
          "Error al procesar la solicitud. Por favor, intenta nuevamente.",
      },
    };
  }
}
