import { HourlyActivity } from '@/lib/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Clock } from 'lucide-react';

interface HourlyMessageChartProps {
  data: HourlyActivity[];
}

export function HourlyMessageChart({ data }: HourlyMessageChartProps) {
  // 格式化数据，添加小时标签
  const chartData = data.map(item => ({
    ...item,
    label: `${item.hour}:00`,
  }));

  // 计算 Top 3
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const top3 = sortedData.slice(0, 3);

  // 获取排名颜色
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#ef4444'; // red-500
      case 2: return '#f97316'; // orange-500
      case 3: return '#eab308'; // yellow-500
      default: return 'hsl(var(--primary))';
    }
  };

  // 获取小时的排名 (1-based)
  const getRank = (hour: number) => {
    const index = sortedData.findIndex(item => item.hour === hour);
    return index + 1;
  };

  // 自定义 Dot 组件
  //@ts-ignore
  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    const rank = getRank(payload.hour);

    if (rank > 3) return null; // 非 Top 3 不显示特殊点，或者显示默认小点

    return (
      <circle
        cx={cx}
        cy={cy}
        r={rank === 1 ? 6 : 5}
        stroke={getRankColor(rank)}
        strokeWidth={2}
        fill="white"
      />
    );
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">24小时消息分布</h3>
            <p className="text-sm text-muted-foreground">消息活跃时段分析</p>
          </div>
        </div>

        {/* Top 3 概览 */}
        <div className="flex gap-3">
          {top3.map((item, index) => (
            <div key={item.hour} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
              <div
                className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: getRankColor(index + 1) }}
              >
                {index + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">{item.hour}:00</span>
                <span className="text-[10px] text-muted-foreground">{item.count} 条</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              interval={2}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
              }}
              labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: 600,
                marginBottom: '4px',
              }}
              formatter={(value: number, name: string, props: any) => {
                const rank = getRank(props.payload.hour);
                const rankInfo = rank <= 3 ? (
                  <span style={{ color: getRankColor(rank), fontWeight: 'bold', marginLeft: '8px' }}>
                    #{rank}
                  </span>
                ) : null;
                return [
                  <span key="value" className="flex items-center">
                    <span style={{ color: 'hsl(var(--primary))' }}>{value} 条消息</span>
                    {rankInfo}
                  </span>,
                  ''
                ];
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              // 使用自定义 Dot
              dot={<CustomizedDot />}
              activeDot={{
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 图例说明 */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-primary rounded-full" />
          <span>消息数量</span>
        </div>
        <span className="text-border">|</span>
        <span>横轴：24小时时段</span>
      </div>
    </div>
  );
}
