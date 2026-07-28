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
        router.push("/dashboard");
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
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#C8A84E]/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logoHIGHH.png"
            alt="HighLanders"
            width={80}
            height={80}
            className="mx-auto mb-4 drop-shadow-2xl"
          />
          <h1 className="text-2xl font-bold text-white">HighLanders</h1>
          <p className="text-sm text-white/50 mt-1">Panel de Administración</p>
        </div>

        {/* Glass Card */}
        <div className="glass-card !bg-white/10 !backdrop-blur-2xl p-8 border-white/10">
          {error && (
            <Alert type="error" className="mb-6" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                placeholder="admin@highlanders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 bg-white/10 border-white/10 focus:border-[#C8A84E] focus:bg-white/15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 bg-white/10 border-white/10 focus:border-[#C8A84E] focus:bg-white/15"
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
