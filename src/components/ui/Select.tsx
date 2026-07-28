import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  emptyMessage?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder = "Seleccionar...", emptyMessage = "No hay opciones", id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-[#C8A84E] ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "glass-input block w-full px-4 py-2.5 text-sm text-gray-900",
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M6%208L1%203h10z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] pr-10",
            !props.value && "text-gray-400",
            error && "!border-red-400",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.length === 0 ? (
            <option value="" disabled>{emptyMessage}</option>
          ) : (
            options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
            ))
          )}
        </select>
        {error && <p className="mt-1.5 text-sm text-red-500 font-medium" role="alert">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
