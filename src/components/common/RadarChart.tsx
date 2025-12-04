import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ScoreBreakdown, scoreDimensions } from '@/lib/mockData';
import { InfoTooltip } from './InfoTooltip';

interface RadarChartProps {
  data: ScoreBreakdown;
  showTooltips?: boolean;
}

export function RadarChart({ data, showTooltips = false }: RadarChartProps) {
  const chartData = [
    { dimension: '响应活跃度', value: data.responseActivity, fullMark: 100 },
    { dimension: '成员互动率', value: data.memberInteraction, fullMark: 100 },
    { dimension: '情感健康度', value: data.sentimentHealth, fullMark: 100 },
    { dimension: '话题覆盖度', value: data.topicCoverage, fullMark: 100 },
  ];

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={250}>
        <RechartsRadarChart data={chartData}>
          <PolarGrid stroke="hsl(var(--muted))" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Radar
            name="分数"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      {showTooltips && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(scoreDimensions).map(([key, dim]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-muted-foreground">{dim.name}</span>
              <InfoTooltip content={dim.description} title={`权重: ${dim.weight * 100}%`} />
              <span className="ml-auto font-medium">{data[key as keyof ScoreBreakdown]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
