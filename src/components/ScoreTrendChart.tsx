import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ScoreTrendChartProps {
    data: { date: string; score: number }[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
    if (data.length === 0) return null;

    const scores = data.map(d => d.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    return (
        <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">评分趋势 (近7天)</span>
                <span className="text-xs text-muted-foreground">
                    均分: <span className="text-foreground font-medium">{avgScore}</span>
                </span>
            </div>
            <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                        />
                        <YAxis
                            domain={[Math.max(0, minScore - 10), Math.min(100, maxScore + 10)]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(222 47% 10%)',
                                border: '1px solid hsl(222 30% 18%)',
                                borderRadius: '6px',
                                fontSize: '12px',
                            }}
                            labelStyle={{ color: 'hsl(210 40% 98%)' }}
                            formatter={(value: number) => [`${value} 分`, '评分']}
                        />
                        <ReferenceLine y={avgScore} stroke="hsl(215 20% 45%)" strokeDasharray="3 3" />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(142 70% 45%)"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(142 70% 45%)', r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
