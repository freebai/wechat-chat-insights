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
import { cn } from '@/lib/utils';

interface RadarChartProps {
  data: ScoreBreakdown;
  showTooltips?: boolean;
}

export function RadarChart({ data, showTooltips = false }: RadarChartProps) {
  // 六维雷达图数据
  const chartData = [
    { dimension: '发言渗透率', value: data.speakerPenetration, fullMark: 100, category: 'statistical' },
    { dimension: '发言者人均消息', value: data.avgMessagesPerSpeaker, fullMark: 100, category: 'statistical' },
    { dimension: '消息间隔', value: data.responseSpeedScore, fullMark: 100, category: 'statistical' },
    { dimension: '时间分布', value: data.timeDistributionScore, fullMark: 100, category: 'statistical' },
    { dimension: '话题相关度', value: data.topicRelevanceScore, fullMark: 100, category: 'semantic' },
    { dimension: '交互氛围', value: data.atmosphereScore, fullMark: 100, category: 'semantic' },
  ];

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <RechartsRadarChart data={chartData}>
          <PolarGrid stroke="hsl(var(--muted))" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
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
        <div className="space-y-3">
          {/* 统计类指标 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>统计类指标 (60%)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scoreDimensions)
                .filter(([, dim]) => dim.category === 'statistical')
                .map(([key, dim]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-muted-foreground truncate">{dim.name}</span>
                    <InfoTooltip content={dim.description} title={`权重: ${(dim.weight * 100).toFixed(0)}%`} />
                    <span className="ml-auto font-medium">{Math.round(data[key as keyof ScoreBreakdown])}</span>
                  </div>
                ))}
            </div>
          </div>
          {/* 语义类指标 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>语义类指标 (40%)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scoreDimensions)
                .filter(([, dim]) => dim.category === 'semantic')
                .map(([key, dim]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={cn(
                      "text-muted-foreground truncate",
                      key === 'atmosphereScore' && data.atmosphereScore < 30 && "text-destructive"
                    )}>{dim.name}</span>
                    <InfoTooltip content={dim.description} title={`权重: ${(dim.weight * 100).toFixed(0)}%`} />
                    <span className={cn(
                      "ml-auto font-medium",
                      key === 'atmosphereScore' && data.atmosphereScore < 30 && "text-destructive"
                    )}>{Math.round(data[key as keyof ScoreBreakdown])}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
