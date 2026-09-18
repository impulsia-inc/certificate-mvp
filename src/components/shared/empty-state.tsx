import React from "react";
import { FileQuestion, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center mb-6 ring-1 ring-stone-100">
        <Icon className="h-8 w-8 text-stone-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 max-w-sm mb-8 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
