import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyTrend } from '@/lib/mockData';

interface ActivityChartProps {
  data: DailyTrend[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
      <h3 className="text-lg font-semibold mb-4">消息趋势</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 70% 45%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(142 70% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 10%)',
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: 'hsl(210 40% 98%)' }}
              itemStyle={{ color: 'hsl(142 70% 45%)' }}
            />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="hsl(142 70% 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMessages)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
