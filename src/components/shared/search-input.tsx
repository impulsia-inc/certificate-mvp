"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
}

export function SearchInput({
  onChange,
  debounceMs = 300,
  isLoading = false,
  className,
  value: externalValue,
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState(externalValue?.toString() || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, debounceMs, onChange]);

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue.toString());
    }
  }, [externalValue]);

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-10 border-stone-200 focus-visible:ring-[#C9A96E] bg-white rounded-md"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center space-x-1">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-stone-500" />}
        {!isLoading && value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-stone-400 hover:text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E] rounded-full p-1"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
