import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { MetricKey } from './BaseMetricsDisplay';

interface MetricTrendChartProps {
  data: Array<{
    date: string;
    totalMessages: number;
    activeSpeakers: number;
    activeHours: number;
    top20Percentage: number;
    medianResponseInterval: number;
    totalMembers: number;
  }>;
  selectedMetric: MetricKey;
}

const metricConfig: Record<MetricKey, { label: string; color: string; unit: string }> = {
  totalMessages: { label: '总消息数', color: 'hsl(var(--chart-1))', unit: '条' },
  totalMembers: { label: '群成员总数', color: 'hsl(var(--chart-2))', unit: '人' },
  activeSpeakers: { label: '发言人数', color: 'hsl(var(--chart-3))', unit: '人' },
  activeHours: { label: '活跃时段数', color: 'hsl(var(--chart-4))', unit: '小时' },
  top20Percentage: { label: '核心成员消息占比', color: 'hsl(var(--chart-5))', unit: '%' },
  medianResponseInterval: { label: '响应间隔中位数', color: 'hsl(var(--primary))', unit: '秒' },
};

export function MetricTrendChart({ data, selectedMetric }: MetricTrendChartProps) {
  const config = metricConfig[selectedMetric];

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{config.label}趋势</h3>
        <span className="text-xs text-muted-foreground">近7天</span>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value} ${config.unit}`, config.label]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={config.color}
              strokeWidth={2}
              fill={`url(#gradient-${selectedMetric})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
