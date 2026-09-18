import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 hover:border-[#C9A96E]/50 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <Icon className="h-5 w-5 text-stone-400" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-stone-900">{value}</p>
        {description && (
          <p className="text-sm text-stone-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
