import { LucideIcon, MessageSquare, Users, UserCheck, PieChart, Percent, BarChart3 } from 'lucide-react';
import { InfoTooltip } from './common/InfoTooltip';
import { cn } from '@/lib/utils';

export type MetricKey = 'totalMessages' | 'activeSpeakers' | 'participationRate' | 'top20Percentage' | 'avgMessagesPerSpeaker' | 'totalMembers';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    description: string;
    colorClass: string;
    isSelected?: boolean;
    onClick?: () => void;
}

function MetricCard({ title, value, unit, icon: Icon, description, colorClass, isSelected, onClick }: MetricCardProps) {
    return (
        <div
            className={cn(
                "bg-card rounded-xl p-5 border transition-all cursor-pointer group",
                isSelected
                    ? "border-primary shadow-sm ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:shadow-sm"
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h4>
                    <InfoTooltip content={description} />
                </div>
                <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", colorClass)}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                {unit && <span className="text-sm text-muted-foreground font-medium">{unit}</span>}
            </div>
        </div>
    );
}

interface BaseMetricsDisplayProps {
    totalMessages: number;
    totalMembers: number;
    activeSpeakers: number;
    top20Percentage: number;
    selectedMetric?: MetricKey;
    onMetricSelect?: (metric: MetricKey) => void;
}

export function BaseMetricsDisplay({
    totalMessages,
    totalMembers,
    activeSpeakers,
    top20Percentage,
    selectedMetric,
    onMetricSelect,
}: BaseMetricsDisplayProps) {
    const participationRate = totalMembers > 0 ? (activeSpeakers / totalMembers) * 100 : 0;
    const avgMessagesPerSpeaker = activeSpeakers > 0 ? (totalMessages / activeSpeakers) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
                title="总消息数"
                value={totalMessages}
                unit="条"
                icon={MessageSquare}
                description="统计周期内群组的消息总量"
                colorClass="bg-blue-50 text-blue-600"
                isSelected={selectedMetric === 'totalMessages'}
                onClick={() => onMetricSelect?.('totalMessages')}
            />

            <MetricCard
                title="群成员总数"
                value={totalMembers}
                unit="人"
                icon={Users}
                description="当前群组的成员数量"
                colorClass="bg-emerald-50 text-emerald-600"
                isSelected={selectedMetric === 'totalMembers'}
                onClick={() => onMetricSelect?.('totalMembers')}
            />

            <MetricCard
                title="发言人数"
                value={activeSpeakers}
                unit="人"
                icon={UserCheck}
                description="统计周期内至少发送过一条消息的成员数"
                colorClass="bg-purple-50 text-purple-600"
                isSelected={selectedMetric === 'activeSpeakers'}
                onClick={() => onMetricSelect?.('activeSpeakers')}
            />

            <MetricCard
                title="参与度"
                value={participationRate.toFixed(1)}
                unit="%"
                icon={Percent}
                description="发言人数占群成员总数的比例，反映群成员参与互动的程度"
                colorClass="bg-amber-50 text-amber-600"
                isSelected={selectedMetric === 'participationRate'}
                onClick={() => onMetricSelect?.('participationRate')}
            />

            <MetricCard
                title="人均消息"
                value={avgMessagesPerSpeaker.toFixed(1)}
                unit="条"
                icon={BarChart3}
                description="平均每个发言者发送的消息数量，反映活跃用户的发言频次"
                colorClass="bg-cyan-50 text-cyan-600"
                isSelected={selectedMetric === 'avgMessagesPerSpeaker'}
                onClick={() => onMetricSelect?.('avgMessagesPerSpeaker')}
            />

            <MetricCard
                title="核心成员消息占比"
                value={top20Percentage.toFixed(1)}
                unit="%"
                icon={PieChart}
                description="发言量前20%的成员所贡献的消息占总消息的比例"
                colorClass="bg-rose-50 text-rose-600"
                isSelected={selectedMetric === 'top20Percentage'}
                onClick={() => onMetricSelect?.('top20Percentage')}
            />
        </div>
    );
}
