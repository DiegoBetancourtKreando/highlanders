import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";

  const variants = {
    primary:
      "bg-[#1a3c2a] text-white hover:bg-[#2d5a3f] focus:ring-[#1a3c2a]/30 shadow-lg shadow-[#1a3c2a]/15",
    gold:
      "gold-gradient text-white hover:opacity-90 focus:ring-[#C8A84E]/30 shadow-lg shadow-[#C8A84E]/20",
    secondary:
      "glass-dark text-[#1a3c2a] hover:bg-[#1a3c2a]/10 focus:ring-[#1a3c2a]/20",
    outline:
      "border-2 border-[#C8A84E]/30 text-[#1a3c2a] hover:bg-[#C8A84E]/10 hover:border-[#C8A84E]/60 focus:ring-[#C8A84E]/20",
    ghost:
      "text-gray-600 hover:bg-white/60 hover:text-[#1a3c2a] focus:ring-gray-200",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 shadow-lg shadow-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
