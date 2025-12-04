import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MessageType {
  type: string;
  count: number;
  percentage: number;
}

interface MessageTypeChartProps {
  data: MessageType[];
}

const COLORS = [
  'hsl(142 70% 45%)',
  'hsl(199 89% 48%)',
  'hsl(280 65% 60%)',
  'hsl(35 92% 50%)',
];

export function MessageTypeChart({ data }: MessageTypeChartProps) {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '250ms' }}>
      <h3 className="text-lg font-semibold mb-4">消息类型分布</h3>
      <div className="flex items-center gap-6">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="count"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222 47% 10%)',
                  border: '1px solid hsl(222 30% 18%)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(210 40% 98%)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground">{item.type}</span>
              </div>
              <span className="font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
