import { useState } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ScoreBreakdown, scoreDimensions } from '@/lib/mockData';
import { Info } from 'lucide-react';

interface RadarChartProps {
  data: ScoreBreakdown;
  showTooltips?: boolean;
}

// 维度键到数据键的映射
const dimensionKeyMap: Record<string, keyof ScoreBreakdown> = {
  '发言渗透率': 'speakerPenetration',
  '发言者人均消息': 'avgMessagesPerSpeaker',
  '消息间隔': 'responseSpeedScore',
  '时间分布': 'timeDistributionScore',
  '话题相关度': 'topicRelevanceScore',
  '交互氛围': 'atmosphereScore',
};

// 自定义轴标签组件 - 显示维度名称、分数和 tooltip icon
interface CustomTickProps {
  x: number;
  y: number;
  payload: { value: string };
  data: ScoreBreakdown;
  onHover: (key: string | null) => void;
}

function CustomTick({ x, y, payload, data, onHover }: CustomTickProps) {
  const dimensionKey = dimensionKeyMap[payload.value];
  const score = dimensionKey ? Math.round(data[dimensionKey]) : 0;
  const dimension = dimensionKey ? scoreDimensions[dimensionKey] : null;
  const isLowAtmosphere = dimensionKey === 'atmosphereScore' && score < 30;

  // 根据位置调整文本对齐
  const getAnchor = () => {
    if (x < 150) return 'end';
    if (x > 250) return 'start';
    return 'middle';
  };

  const getYOffset = () => {
    if (y < 80) return -8;
    if (y > 200) return 16;
    return 4;
  };

  const anchor = getAnchor();
  const yOffset = getYOffset();

  return (
    <g transform={`translate(${x},${y + yOffset})`}>
      {/* 维度名称 */}
      <text
        textAnchor={anchor}
        fill={isLowAtmosphere ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'}
        fontSize={11}
        dy={0}
      >
        {payload.value}
      </text>
      {/* 分数 */}
      <text
        textAnchor={anchor}
        fill={isLowAtmosphere ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
        fontSize={12}
        fontWeight="600"
        dy={14}
      >
        {score}分
      </text>
      {/* Tooltip 图标 */}
      {dimension && (
        <g
          transform={`translate(${anchor === 'start' ? -16 : anchor === 'end' ? 2 : -6}, -10)`}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover(dimensionKey)}
          onMouseLeave={() => onHover(null)}
        >
          <circle cx="6" cy="6" r="7" fill="transparent" />
          <foreignObject x="0" y="0" width="12" height="12">
            <div className="flex items-center justify-center w-3 h-3 text-muted-foreground hover:text-primary transition-colors">
              <Info className="w-3 h-3" />
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  );
}

// 自定义 Tooltip 组件
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { dimension: string; value: number; category: string } }>;
}

function CustomChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;
  const dimensionKey = dimensionKeyMap[item.dimension];
  const dimension = dimensionKey ? scoreDimensions[dimensionKey] : null;

  if (!dimension) return null;

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 max-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${item.category === 'statistical' ? 'bg-blue-500' : 'bg-purple-500'}`} />
        <span className="font-medium text-sm">{dimension.name}</span>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        权重: {(dimension.weight * 100).toFixed(0)}%
      </div>
      <p className="text-xs text-muted-foreground">{dimension.description}</p>
    </div>
  );
}

export function RadarChart({ data }: RadarChartProps) {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  // 六维雷达图数据
  const chartData = [
    { dimension: '发言渗透率', value: data.speakerPenetration, fullMark: 100, category: 'statistical' },
    { dimension: '发言者人均消息', value: data.avgMessagesPerSpeaker, fullMark: 100, category: 'statistical' },
    { dimension: '消息间隔', value: data.responseSpeedScore, fullMark: 100, category: 'statistical' },
    { dimension: '时间分布', value: data.timeDistributionScore, fullMark: 100, category: 'statistical' },
    { dimension: '话题相关度', value: data.topicRelevanceScore, fullMark: 100, category: 'semantic' },
    { dimension: '交互氛围', value: data.atmosphereScore, fullMark: 100, category: 'semantic' },
  ];

  // 悬停时显示的描述信息
  const hoveredInfo = hoveredDimension ? scoreDimensions[hoveredDimension as keyof typeof scoreDimensions] : null;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={chartData} outerRadius="65%">
          <PolarGrid stroke="hsl(var(--muted))" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={(props) => (
              <CustomTick {...props} data={data} onHover={setHoveredDimension} />
            )}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="分数"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
          />
          <Tooltip content={<CustomChartTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>

      {/* 悬停 info icon 时显示的说明 */}
      {hoveredInfo && (
        <div className="absolute bottom-2 left-2 right-2 bg-popover/95 border border-border rounded-lg shadow-lg p-3 text-xs z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${hoveredInfo.category === 'statistical' ? 'bg-blue-500' : 'bg-purple-500'}`} />
            <span className="font-medium">{hoveredInfo.name}</span>
            <span className="text-muted-foreground ml-auto">权重: {(hoveredInfo.weight * 100).toFixed(0)}%</span>
          </div>
          <p className="text-muted-foreground">{hoveredInfo.description}</p>
        </div>
      )}
    </div>
  );
}
