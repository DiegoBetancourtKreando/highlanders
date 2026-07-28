// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const SALT_ROUNDS = 10;

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  fullName: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: Omit<AuthPayload, "userId"> & { id: string };
  error?: string;
}

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Credenciales inválidas" };
    }

    if (!user.isActive) {
      return { success: false, error: "Usuario desactivado" };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Credenciales inválidas" };
    }

    // Actualizar último login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    };
  },

  /**
   * Verifica y decodifica un token JWT
   */
  verifyToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch {
      return null;
    }
  },

  /**
   * Extrae el token del header Authorization o de la cookie auth_token
   */
  extractTokenFromRequest(request: Request): string | null {
    // 1. Intentar desde Authorization header
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // 2. Intentar desde la cookie
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }

    return null;
  },

  /**
   * Verifica la autenticación desde los headers o cookies de la request
   */
  async authenticateRequest(
    request: Request
  ): Promise<{ authenticated: boolean; user?: AuthPayload }> {
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      return { authenticated: false };
    }

    const user = this.verifyToken(token);
    if (!user) {
      return { authenticated: false };
    }

    return { authenticated: true, user };
  },

  /**
   * Crea un usuario administrador (para seed)
   */
  async createAdminUser(
    email: string,
    password: string,
    fullName: string,
    role: string = "admin"
  ) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
      },
    });
  },
};
