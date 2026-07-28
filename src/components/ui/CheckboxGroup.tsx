import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxGroupProps {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

export function CheckboxGroup({ label, error, options, selectedValues = [], onChange, required, columns = 2 }: CheckboxGroupProps) {
  const handleToggle = (value: string) => {
    onChange(selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value]);
  };

  return (
    <div className="w-full">
      {label && (
        <p className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-[#C8A84E] ml-1">*</span>}
        </p>
      )}
      <div className={cn("grid gap-2.5", columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-4")}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-xl glass-input cursor-pointer transition-all duration-200",
              selectedValues.includes(option.value)
                ? "border-[#C8A84E] bg-[#C8A84E]/8 shadow-sm shadow-[#C8A84E]/10"
                : "hover:border-[#C8A84E]/30"
            )}
          >
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a3c2a] focus:ring-[#C8A84E] accent-[#1a3c2a]" checked={selectedValues.includes(option.value)} onChange={() => handleToggle(option.value)} />
            <span className="text-sm font-medium text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500 font-medium" role="alert">{error}</p>}
    </div>
  );
}
