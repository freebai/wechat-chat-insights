import { HourlyActivity } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface HourlyHeatmapProps {
  data: HourlyActivity[];
}

export function HourlyHeatmap({ data }: HourlyHeatmapProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  const getIntensity = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'bg-primary';
    if (ratio > 0.6) return 'bg-primary/80';
    if (ratio > 0.4) return 'bg-primary/60';
    if (ratio > 0.2) return 'bg-primary/40';
    return 'bg-primary/20';
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">活跃时段分布</h3>
      <div className="grid grid-cols-12 gap-1.5">
        {data.map((item) => (
          <div
            key={item.hour}
            className={cn(
              "aspect-square rounded-sm transition-all duration-200 hover:scale-110 cursor-pointer",
              getIntensity(item.count)
            )}
            title={`${item.hour}:00 - ${item.count} 条消息`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>0:00</span>
        <span>6:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground">少</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span className="text-xs text-muted-foreground">多</span>
      </div>
    </div>
  );
}
