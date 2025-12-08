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

// 消息类型颜色配置 - 与图片中的颜色对应
const COLORS = [
  '#3B82F6', // 文本 - 蓝色
  '#EF4444', // 语音 - 红色
  '#F59E0B', // 图片 - 橙黄色
  '#EC4899', // 撤回 - 粉红色
  '#8B5CF6', // 同意 - 紫色
  '#6B7280', // 不同意 - 灰色
  '#06B6D4', // 视频 - 青色
  '#F97316', // 名片 - 橙色
  '#3B82F6', // 位置 - 蓝色
  '#A855F7', // 表情 - 浅紫色
  '#10B981', // 文件 - 绿色
  '#22D3EE', // 链接 - 浅青色
  '#6366F1', // 小程序 - 靛蓝色
  '#9CA3AF', // 会话记录 - 浅灰色
  '#EAB308', // 待办 - 黄色
  '#A78BFA', // 投票 - 淡紫色
  '#84CC16', // 填表 - 黄绿色
  '#F5F5F5', // 红包 - 浅色（实际应该是红色但图片显示很浅）
  '#DC2626', // 会议 - 深红色
  '#2563EB', // 在线文档 - 深蓝色
  '#D946EF', // 【图文消息】- 洋红色
  '#78716C', // 日程消息 - 棕灰色
  '#0EA5E9', // 混合消息 - 天蓝色
  '#FB7185', // 音频存档 - 浅粉色
  '#E879F9', // 音频共享文档 - 浅洋红色
  '#F472B6', // 互通红包消息 - 粉色
  '#64748B', // MarkDown - 石板灰色
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
      <div className="flex gap-6">
        <div className="w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={1}
                dataKey="count"
                stroke="hsl(var(--card))"
                strokeWidth={1}
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
                formatter={(value: number, name: string) => [`${value} 条`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 content-start">
          {data.map((item, index) => (
            <div key={item.type} className="flex items-center gap-2 text-xs group">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate">{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
