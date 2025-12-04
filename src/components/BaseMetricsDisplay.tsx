import { LucideIcon, MessageSquare, Users, UserCheck, PieChart, Clock } from 'lucide-react';
import { InfoTooltip } from './common/InfoTooltip';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    description: string;
    color?: string;
}

function MetricCard({ title, value, unit, icon: Icon, description, color = 'primary' }: MetricCardProps) {
    return (
        <div className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
                    <InfoTooltip content={description} />
                </div>
                <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
        </div>
    );
}

interface BaseMetricsDisplayProps {
    totalMessages: number;
    totalMembers: number;
    activeSpeakers: number;
    activeHours: number;
    totalHours?: number;
    top20Percentage: number;
}

export function BaseMetricsDisplay({
    totalMessages,
    totalMembers,
    activeSpeakers,
    activeHours,
    totalHours = 24,
    top20Percentage,
}: BaseMetricsDisplayProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">基础指标</h3>
                <span className="text-sm text-muted-foreground">用于计算评分的原始数据</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 总消息数 */}
                <MetricCard
                    title="总消息数"
                    value={totalMessages}
                    unit="条"
                    icon={MessageSquare}
                    description="统计周期内群组的消息总量"
                    color="blue"
                />

                {/* 群成员总数 */}
                <MetricCard
                    title="群成员总数"
                    value={totalMembers}
                    unit="人"
                    icon={Users}
                    description="当前群组的成员数量"
                    color="green"
                />

                {/* 发言人数 */}
                <MetricCard
                    title="发言人数"
                    value={activeSpeakers}
                    unit="人"
                    icon={UserCheck}
                    description="统计周期内至少发送过一条消息的成员数"
                    color="purple"
                />

                {/* 活跃时段数 */}
                <MetricCard
                    title="活跃时段数"
                    value={activeHours}
                    unit={`/${totalHours}小时`}
                    icon={Clock}
                    description="有消息发送的小时时段数量"
                    color="orange"
                />

                {/* Top 20% 成员消息占比 */}
                <MetricCard
                    title="核心成员消息占比"
                    value={top20Percentage.toFixed(1)}
                    unit="%"
                    icon={PieChart}
                    description="发言量前20%的成员所贡献的消息占总消息的比例"
                    color="pink"
                />
            </div>
        </div>
    );
}
