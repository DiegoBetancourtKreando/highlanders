"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Icons.chart />,
  },
  {
    label: "Jugadores",
    href: "/jugadores",
    icon: <Icons.users />,
  },
  {
    label: "Solicitudes",
    href: "/solicitudes",
    icon: <Icons.shirt />,
  },
  {
    label: "Importar Datos",
    href: "/importar",
    icon: <Icons.upload />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));

    if (!token) {
      router.push("/login");
      return;
    }

    // Decodificar info del usuario del JWT (payload)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.fullName || "Admin");
      setIsAuthenticated(true);
    } catch {
      document.cookie =
        "auth_token=; path=/; max-age=0; SameSite=Strict";
      router.push("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
    router.push("/login");
  };

  // Si está en login, no mostrar layout admin
  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
        <div className="animate-spin h-8 w-8 border-2 border-[#C8A84E] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentPage = navItems.find((item) => pathname.startsWith(item.href))?.label || "Panel";

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Dynamic Island Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="island-nav flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logoHIGHH.png" alt="H" width={28} height={28} className="object-contain" />
            <span className="font-semibold text-sm text-white hidden sm:block">HighLanders</span>
            <span className="text-white/30 hidden sm:block">|</span>
            <span className="text-sm font-medium text-white/80">{currentPage}</span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    isActive ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <div className="w-px h-6 bg-white/10 mx-2" />
            <div className="flex items-center gap-2 px-2">
              <div className="w-6 h-6 rounded-full bg-[#C8A84E]/30 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{userName.charAt(0)}</span>
              </div>
              <span className="text-xs text-white/60 hidden sm:block">{userName}</span>
              <button onClick={handleLogout} className="text-white/40 hover:text-white/80 transition-colors" title="Cerrar sesión">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {children}
      </main>
    </div>
  );
}
