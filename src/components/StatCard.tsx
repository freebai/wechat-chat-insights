import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, delay = 0 }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border border-border animate-fade-up relative overflow-hidden group",
        "hover:shadow-md hover:border-primary/20 transition-all duration-300"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500" />
      
      <div className="flex items-start justify-between relative">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "text-emerald-600 bg-emerald-50" 
                : "text-red-600 bg-red-50"
            )}>
              <span className={cn(
                "text-xs",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {Math.abs(trend.value)}%
              <span className="text-muted-foreground font-normal">vs 上周</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
