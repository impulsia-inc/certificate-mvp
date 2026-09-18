import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  type?: "spinner" | "skeleton";
}

export function LoadingState({
  message = "Cargando...",
  className,
  type = "spinner",
}: LoadingStateProps) {
  if (type === "skeleton") {
    return (
      <div className={cn("w-full max-w-4xl mx-auto rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm animate-pulse", className)}>
        <div className="flex flex-col md:flex-row border-b border-stone-100">
          <div className="md:w-1/3 bg-stone-50 p-8 flex items-center justify-center min-h-[300px]">
            <div className="w-full aspect-square bg-stone-200 rounded-lg"></div>
          </div>
          <div className="md:w-2/3 p-8 flex flex-col justify-between">
            <div>
              <div className="h-8 bg-stone-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-stone-100 rounded w-1/4 mb-8"></div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="h-3 bg-stone-100 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-stone-200 rounded w-2/3"></div>
                </div>
                <div>
                  <div className="h-3 bg-stone-100 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-stone-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="h-10 bg-stone-200 rounded w-32 mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-12", className)}>
      <Loader2 className="h-8 w-8 text-[#C9A96E] animate-spin mb-4" />
      <p className="text-sm text-stone-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
