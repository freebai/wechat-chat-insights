import { useMemo, useState } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { Info, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { ScoreBreakdown, scoreDimensions, getScoreLevel } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { ScoreRing } from './common/ScoreRing';
import { ScoreTrendChart } from './ScoreTrendChart';

interface CompositeScoreCardProps {
    overallScore: number;
    scoreBreakdown: ScoreBreakdown;
    scoreTrend: number;
    totalAnalyses: number;
    hasConflictRisk?: boolean;
    scoreTrendData: Array<{ date: string; score: number }>;
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

// 自定义轴标签组件
function CustomTick({ x, y, payload, data, onHover }: any) {
    const dimensionKey = dimensionKeyMap[payload.value];
    const score = dimensionKey ? Math.round(data[dimensionKey]) : 0;
    const dimension = dimensionKey ? scoreDimensions[dimensionKey] : null;

    // 根据位置调整文本对齐
    const anchor = x < 150 ? 'end' : x > 250 ? 'start' : 'middle';
    const yOffset = y < 80 ? -8 : y > 200 ? 16 : 4;

    return (
        <g transform={`translate(${x},${y + yOffset})`}>
            <text
                textAnchor={anchor}
                fill="hsl(var(--muted-foreground))"
                fontSize={11}
                dy={0}
            >
                {payload.value}
            </text>
            <text
                textAnchor={anchor}
                fill="hsl(var(--foreground))"
                fontSize={12}
                fontWeight="600"
                dy={14}
            >
                {score}
            </text>
            {dimension && (
                <g
                    transform={`translate(${anchor === 'start' ? -16 : anchor === 'end' ? 2 : -6}, -10)`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => onHover(dimensionKey)}
                    onMouseLeave={() => onHover(null)}
                >
                    <circle cx="6" cy="6" r="6" fill="transparent" />
                    {/* Invisible hit area */}
                </g>
            )}
        </g>
    );
}

export function CompositeScoreCard({
    overallScore,
    scoreBreakdown,
    scoreTrend,
    totalAnalyses,
    hasConflictRisk,
    scoreTrendData
}: CompositeScoreCardProps) {
    const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
    const level = getScoreLevel(overallScore);

    const chartData = useMemo(() => [
        { dimension: '发言渗透率', value: scoreBreakdown.speakerPenetration, fullMark: 100 },
        { dimension: '发言者人均消息', value: scoreBreakdown.avgMessagesPerSpeaker, fullMark: 100 },
        { dimension: '消息间隔', value: scoreBreakdown.responseSpeedScore, fullMark: 100 },
        { dimension: '时间分布', value: scoreBreakdown.timeDistributionScore, fullMark: 100 },
        { dimension: '话题相关度', value: scoreBreakdown.topicRelevanceScore, fullMark: 100 },
        { dimension: '交互氛围', value: scoreBreakdown.atmosphereScore, fullMark: 100 },
    ], [scoreBreakdown]);

    const hoveredInfo = hoveredDimension ? scoreDimensions[hoveredDimension as keyof typeof scoreDimensions] : null;

    return (
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
            {/* 背景装饰：柔和的光晕 */}
            <div className={cn("absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none", level.color.replace('text-', 'bg-'))} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* 左侧：核心评分与趋势 */}
                <div className="lg:col-span-5 flex flex-col justify-between border-r border-border/50 pr-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            健康度评分
                            {hasConflictRisk && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive flex items-center gap-1 font-normal">
                                    <AlertTriangle className="w-3 h-3" />
                                    评分已降权
                                </span>
                            )}
                        </h3>

                        <div className="flex items-center gap-8 mb-8">
                            <div className="relative">
                                <ScoreRing score={overallScore} size="lg" showLabel={false} />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-center min-w-max">
                                    <span className={cn("px-3 py-1 rounded-full text-sm font-semibold border", level.bgColor, level.borderColor, level.color)}>
                                        {level.label}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">较上周</span>
                                    <div className="flex items-center gap-1">
                                        {scoreTrend >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-rose-500" />}
                                        <span className={cn("text-lg font-bold", scoreTrend >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                            {Math.abs(scoreTrend)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">分析次数</span>
                                    <span className="text-lg font-semibold">{totalAnalyses}</span>
                                </div>
                                <div className="pt-2 text-xs text-muted-foreground leading-relaxed">
                                    基于最近 {totalAnalyses} 次分析结果生成的综合健康评分，反映了群聊的活跃度与质量。
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[100px] w-full mt-auto">
                        <ScoreTrendChart data={scoreTrendData} />
                    </div>
                </div>

                {/* 右侧：六维雷达图 */}
                <div className="lg:col-span-7 relative flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">六维能力模型</h3>
                        {hoveredInfo ? (
                            <div className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <span className="font-semibold text-primary">{hoveredInfo.name}</span>
                                <span className="text-muted-foreground">权重 {(hoveredInfo.weight * 100).toFixed(0)}%</span>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Info className="w-3 h-3" /> Hover 维度查看详情
                            </div>
                        )}
                    </div>

                    {/* 描述信息占位区域 - 固定高度防止跳动 */}
                    <div className="h-10 mb-2">
                        {hoveredInfo && (
                            <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50 animate-in fade-in duration-200">
                                {hoveredInfo.description}
                            </p>
                        )}
                    </div>

                    <div className="flex-1 min-h-[300px] w-full items-center justify-center flex">
                        <ResponsiveContainer width="100%" height={320}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                <PolarGrid stroke="hsl(var(--muted))" strokeOpacity={0.5} />
                                <PolarAngleAxis
                                    dataKey="dimension"
                                    tick={(props) => (
                                        <CustomTick {...props} data={scoreBreakdown} onHover={setHoveredDimension} />
                                    )}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 100]}
                                    tick={false}
                                    axisLine={false}
                                />
                                <Radar
                                    name="Current Group"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.2}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
