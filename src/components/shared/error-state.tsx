import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Ha ocurrido un error",
  description = "No pudimos completar esta acción. Por favor, intenta nuevamente más tarde.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center mb-4 ring-1 ring-rose-100">
        <AlertCircle className="h-6 w-6 text-rose-500" />
      </div>
      <h3 className="text-lg font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
