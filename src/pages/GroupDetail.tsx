import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockChatGroups, generateMockReports } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { HourlyHeatmap } from '@/components/HourlyHeatmap';
import { MemberRanking } from '@/components/MemberRanking';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { MessageTypeChart } from '@/components/MessageTypeChart';
import { BaseMetricsDisplay, MetricKey } from '@/components/BaseMetricsDisplay';
import { MetricTrendChart } from '@/components/MetricTrendChart';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const group = mockChatGroups.find(g => g.id === id);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from, to };
  });

  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('totalMessages');

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

  // 趋势数据：最少展示7天，以选择器的结束时间往前推
  const trendReports = useMemo(() => {
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const daysToShow = Math.max(7, daysDiff);
    const from = new Date(dateRange.to);
    from.setDate(from.getDate() - daysToShow);
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= from && reportDate <= dateRange.to;
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

  // 指标趋势数据
  const metricTrendData = trendReports.map(r => ({
    date: r.date.slice(5),
    totalMessages: r.baseMetrics.totalMessages,
    activeSpeakers: r.baseMetrics.activeSpeakers,
    activeHours: r.baseMetrics.activeHours,
    top20Percentage: r.baseMetrics.top20Percentage,
    medianResponseInterval: r.baseMetrics.medianResponseInterval || 0,
    totalMembers: r.baseMetrics.totalMembers,
  })).reverse();

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
          <h1 className="text-2xl font-bold">{group.name}</h1>
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

      {/* Excluded from Analysis Notice */}
      {group.isExcludedFromScoring && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-blue-500/10 border border-blue-500/30">
          <Info className="h-5 w-5 text-blue-400 shrink-0" />
          <p className="text-sm text-blue-400">
            此群聊已配置为不参与分析，但基础指标仍正常统计。
          </p>
        </div>
      )}

      {/* AI Analysis Panel */}
      <div className="mb-6">
        <AIAnalysisPanel insight={latestReport.aiInsight} date={latestReport.date} />
      </div>

      {/* Base Metrics - Full Width */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">基础指标</h3>
          <span className="text-sm text-muted-foreground">点击指标查看趋势</span>
        </div>
        <BaseMetricsDisplay
          totalMessages={latestReport.baseMetrics.totalMessages}
          totalMembers={latestReport.baseMetrics.totalMembers}
          activeSpeakers={latestReport.baseMetrics.activeSpeakers}
          activeHours={latestReport.baseMetrics.activeHours}
          totalHours={latestReport.baseMetrics.totalHours}
          top20Percentage={latestReport.baseMetrics.top20Percentage}
          medianResponseInterval={latestReport.baseMetrics.medianResponseInterval}
          selectedMetric={selectedMetric}
          onMetricSelect={setSelectedMetric}
        />
      </div>

      {/* Metric Trend Chart + Hourly Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MetricTrendChart data={metricTrendData} selectedMetric={selectedMetric} />
        </div>
        <HourlyHeatmap data={latestReport.hourlyActivity} />
      </div>

      {/* Member Ranking + Message Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberRanking members={latestReport.memberStats} />
        <MessageTypeChart data={latestReport.messageTypes} />
      </div>
    </div>
  );
}
