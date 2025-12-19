import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MetricKey } from './BaseMetricsDisplay';
import { TrendingUp } from 'lucide-react';

interface MetricTrendChartProps {
  data: Array<{
    date: string;
    totalMessages: number;
    activeSpeakers: number;
    participationRate: number;
    top20Percentage: number;
    avgMessagesPerSpeaker: number;
    totalMembers: number;
  }>;
  selectedMetric: MetricKey;
}

const metricConfig: Record<MetricKey, { label: string; color: string; unit: string; bgClass: string }> = {
  totalMessages: { label: '总消息数', color: 'hsl(199 89% 48%)', unit: '条', bgClass: 'bg-blue-50 text-blue-600' },
  totalMembers: { label: '群成员总数', color: 'hsl(142 70% 40%)', unit: '人', bgClass: 'bg-emerald-50 text-emerald-600' },
  activeSpeakers: { label: '发言人数', color: 'hsl(280 65% 55%)', unit: '人', bgClass: 'bg-purple-50 text-purple-600' },
  participationRate: { label: '参与度', color: 'hsl(35 92% 50%)', unit: '%', bgClass: 'bg-amber-50 text-amber-600' },
  top20Percentage: { label: '核心成员消息占比', color: 'hsl(340 75% 50%)', unit: '%', bgClass: 'bg-rose-50 text-rose-600' },
  avgMessagesPerSpeaker: { label: '人均消息', color: 'hsl(186 100% 42%)', unit: '条', bgClass: 'bg-cyan-50 text-cyan-600' },
};

export function MetricTrendChart({ data, selectedMetric }: MetricTrendChartProps) {
  const config = metricConfig[selectedMetric];

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${config.bgClass}`}>
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-semibold">{config.label}趋势</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">近{data.length}天</span>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              interval={data.length > 10 ? Math.floor(data.length / 5) : 0}
              minTickGap={20}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={45}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                padding: '12px 16px',
              }}
              formatter={(value: number) => [`${typeof value === 'number' ? value.toFixed(1) : value} ${config.unit}`, config.label]}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
              cursor={{ stroke: config.color, strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={config.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${selectedMetric})`}
              dot={false}
              activeDot={{
                r: 6,
                fill: config.color,
                stroke: 'hsl(var(--card))',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
