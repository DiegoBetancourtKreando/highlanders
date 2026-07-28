import React from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const styles = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-500",
    title: "text-emerald-800",
    text: "text-emerald-700",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: "text-red-500",
    title: "text-red-800",
    text: "text-red-700",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: "text-amber-500",
    title: "text-amber-800",
    text: "text-amber-700",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-800",
    text: "text-blue-700",
  },
};

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

export function Alert({ type, title, children, onClose, className }: AlertProps) {
  const s = styles[type];

  return (
    <div className={cn("rounded-lg border p-4", s.bg, className)} role="alert">
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${s.icon}`}>{icons[type]}</div>
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${s.title}`}>{title}</h3>
          )}
          <div className={`text-sm mt-1 ${s.text}`}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${s.icon} hover:opacity-75`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
