import React from "react";
import { cn } from "@/lib/utils";

interface CardProps { className?: string; children: React.ReactNode; }

export function Card({ className, children }: CardProps) {
  return <div className={cn("glass-card", className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 py-5 border-b border-gray-100/50", className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function StatCard({ title, value, icon, color = "emerald" }: { title: string; value: string | number; icon: React.ReactNode; color?: "emerald" | "blue" | "amber" | "purple" | "rose" }) {
  const colors = {
    emerald: "bg-emerald-50/80 text-emerald-600",
    blue: "bg-blue-50/80 text-blue-600",
    amber: "bg-amber-50/80 text-amber-600",
    purple: "bg-purple-50/80 text-purple-600",
    rose: "bg-rose-50/80 text-rose-600",
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-[#1a3c2a] mt-1">{value}</p>
          </div>
          <div className={cn("p-3 rounded-xl", colors[color])}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
