import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CertificateStatus } from "@/types";

interface StatusBadgeProps {
  status: CertificateStatus | "active" | "revoked" | "draft" | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="outline"
          className={cn("bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium tracking-wide", className)}
        >
          Activo
        </Badge>
      );
    case "revoked":
      return (
        <Badge
          variant="outline"
          className={cn("bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-medium tracking-wide", className)}
        >
          Anulado
        </Badge>
      );
    case "draft":
    default:
      return (
        <Badge
          variant="outline"
          className={cn("bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium tracking-wide", className)}
        >
          Borrador
        </Badge>
      );
  }
}
