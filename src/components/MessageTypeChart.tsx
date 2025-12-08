import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';

interface MessageType {
  type: string;
  count: number;
  percentage: number;
}

interface MessageTypeChartProps {
  data: MessageType[];
}

const COLORS = [
  'hsl(142 70% 40%)',
  'hsl(199 89% 48%)',
  'hsl(280 65% 55%)',
  'hsl(35 92% 50%)',
];

export function MessageTypeChart({ data }: MessageTypeChartProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-up" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-purple-50">
          <PieChartIcon className="h-4 w-4 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold">消息类型分布</h3>
      </div>
      <div className="flex items-center gap-8">
        <div className="w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="count"
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '10px 14px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between text-sm group">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.type}</span>
              </div>
              <span className="font-semibold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
