import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  backHref?: string;
}

export function PageHeader({ title, description, action, backHref }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        {backHref && (
          <Link 
            href={backHref}
            className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">{title}</h1>
        {description && (
          <p className="text-stone-500 text-sm">{description}</p>
        )}
      </div>
      
      {action && (
        <Button asChild className="bg-[#C9A96E] hover:bg-[#b5955a] text-white">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
