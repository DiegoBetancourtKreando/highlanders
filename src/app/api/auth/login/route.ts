import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return apiError(
        Object.values(errors).flat().join(", ") || "Datos inválidos"
      );
    }

    const result = await authService.login(
      validation.data.email,
      validation.data.password
    );

    if (!result.success) {
      return apiError(result.error || "Error de autenticación", 401);
    }

    return apiSuccess({
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Error interno del servidor", 500);
  }
}
