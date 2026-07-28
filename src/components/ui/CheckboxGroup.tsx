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

export function CheckboxGroup({
  label,
  error,
  options,
  selectedValues = [],
  onChange,
  required,
  columns = 2,
}: CheckboxGroupProps) {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className="w-full">
      {label && (
        <p className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
      )}
      <div className={cn("grid gap-3", gridCols[columns])}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
              "hover:border-emerald-300 hover:bg-emerald-50",
              selectedValues.includes(option.value)
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 bg-white"
            )}
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
            />
            <span className="text-sm font-medium text-gray-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
