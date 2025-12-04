import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockChatGroups, generateMockReports, getScoreLevel } from '@/lib/mockData';
import { ScoreRing } from '@/components/common/ScoreRing';
import { RadarChart } from '@/components/common/RadarChart';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { ActivityChart } from '@/components/ActivityChart';
import { HourlyHeatmap } from '@/components/HourlyHeatmap';
import { MemberRanking } from '@/components/MemberRanking';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { MessageTypeChart } from '@/components/MessageTypeChart';
import { BaseMetricsDisplay } from '@/components/BaseMetricsDisplay';
import { cn } from '@/lib/utils';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const group = mockChatGroups.find(g => g.id === id);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from, to };
  });

  const reports = useMemo(() => {
    if (!id) return [];
    return generateMockReports(id, 30);
  }, [id]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= dateRange.from && reportDate <= dateRange.to;
    });
  }, [reports, dateRange]);

  const latestReport = filteredReports[0];

  if (!group || !latestReport) {
    return (
      <div className="container max-w-7xl mx-auto px-6 py-8">
        <p className="text-muted-foreground">群聊不存在</p>
      </div>
    );
  }

  const level = getScoreLevel(group.latestScore);
  const trendData = filteredReports.map(r => ({
    date: r.date.slice(5),
    messages: r.messageCount,
  })).reverse();

  const scoreTrend = filteredReports.length > 1
    ? latestReport.overallScore - filteredReports[filteredReports.length - 1].overallScore
    : 0;

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/groups">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <span className={cn('text-sm px-3 py-1 rounded', level.bgColor, level.color)}>
              {level.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.memberCount} 成员
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              创建于 {group.createdAt}
            </span>
          </div>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">健康评分</h3>
          <div className="flex items-center gap-6">
            <ScoreRing score={latestReport.overallScore} size="lg" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {scoreTrend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={cn(
                  'text-sm',
                  scoreTrend >= 0 ? 'text-primary' : 'text-destructive'
                )}>
                  {scoreTrend >= 0 ? '+' : ''}{scoreTrend} 分
                </span>
                <span className="text-sm text-muted-foreground">vs 期初</span>
              </div>
              <p className="text-sm text-muted-foreground">
                分析周期内共 {filteredReports.length} 次分析
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">五维评分</h3>
          <RadarChart data={latestReport.scoreBreakdown} showTooltips />
        </div>
      </div>

      {/* Base Metrics */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <BaseMetricsDisplay
          totalMessages={latestReport.baseMetrics.totalMessages}
          totalMembers={latestReport.baseMetrics.totalMembers}
          activeSpeakers={latestReport.baseMetrics.activeSpeakers}
          activeHours={latestReport.baseMetrics.activeHours}
          top20Percentage={latestReport.baseMetrics.top20Percentage}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ActivityChart data={trendData} />
        </div>
        <HourlyHeatmap data={latestReport.hourlyActivity} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <MemberRanking members={latestReport.memberStats} />
          <MessageTypeChart data={latestReport.messageTypes} />
        </div>
        <div className="lg:col-span-2">
          <AIAnalysisPanel insight={latestReport.aiInsight} />
        </div>
      </div>
    </div>
  );
}
