"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        document.cookie = `auth_token=${data.data.token}; path=/; max-age=28800; SameSite=Strict`;
        // Usar window.location para navegación forzada (más confiable que router.push)
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      {/* Modal overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Modal card */}
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Image
              src="/logoHIGHH.png"
              alt="HighLanders"
              width={64}
              height={64}
              className="mx-auto mb-3 drop-shadow-lg"
            />
            <h1 className="text-xl font-bold text-[#1a3c2a]">HighLanders</h1>
            <p className="text-sm text-gray-500 mt-0.5">Panel de Administración</p>
          </div>

          <div className="text-center mb-4">
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a3c2a] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al inicio
            </a>
          </div>

          {error && (
            <Alert type="error" className="mb-5" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                placeholder="admin@highlanders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white border-gray-200 focus:border-[#C8A84E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white border-gray-200 focus:border-[#C8A84E]"
              />
            </div>
            <Button type="submit" loading={loading} variant="gold" className="w-full">
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
