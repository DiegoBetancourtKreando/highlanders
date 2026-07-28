import React from "react";
import { cn } from "@/lib/utils";

interface TableProps { children: React.ReactNode; className?: string; }

export function Table({ children }: TableProps) {
  return <div className="glass-table"><table className="w-full">{children}</table></div>;
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <thead className={cn("bg-gray-50/50", className)}>{children}</thead>;
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={cn("divide-y divide-gray-100/60", className)}>{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn("transition-colors hover:bg-[#C8A84E]/4", className)}>{children}</tr>;
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider", className)}>{children}</th>;
}

export function TableCell({ children, className, colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={cn("px-4 py-3.5 text-sm text-gray-700", className)}>{children}</td>;
}

interface BadgeProps { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info"; className?: string; }

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100/80 text-gray-700 border-gray-200/50",
    success: "bg-emerald-50/80 text-emerald-700 border-emerald-200/50",
    warning: "bg-amber-50/80 text-amber-700 border-amber-200/50",
    danger: "bg-red-50/80 text-red-700 border-red-200/50",
    info: "bg-blue-50/80 text-blue-700 border-blue-200/50",
  };
  return <span className={cn("glass-badge", variants[variant], className)}>{children}</span>;
}

interface PaginationProps { page: number; totalPages: number; }

export function Pagination({ page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100/50">
      <div className="text-sm text-gray-500">Página {page} de {totalPages}</div>
      <div className="flex gap-2">
        <a href={`?page=${Math.max(1, page - 1)}`} className={`px-4 py-2 text-sm rounded-full glass-input transition-all ${page <= 1 ? "opacity-40 pointer-events-none" : "hover:border-[#C8A84E]/40"}`}>Anterior</a>
        <a href={`?page=${Math.min(totalPages, page + 1)}`} className={`px-4 py-2 text-sm rounded-full glass-input transition-all ${page >= totalPages ? "opacity-40 pointer-events-none" : "hover:border-[#C8A84E]/40"}`}>Siguiente</a>
      </div>
    </div>
  );
}
