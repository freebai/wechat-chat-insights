import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, Info, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockChatGroups, generateMockReports } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
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
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">群聊不存在</p>
        </div>
      </div>
    );
  }

  // 指标趋势数据
  const metricTrendData = trendReports.map(r => {
    const participationRate = r.baseMetrics.totalMembers > 0 ? (r.baseMetrics.activeSpeakers / r.baseMetrics.totalMembers) * 100 : 0;
    const avgMessagesPerSpeaker = r.baseMetrics.activeSpeakers > 0 ? (r.baseMetrics.totalMessages / r.baseMetrics.activeSpeakers) : 0;
    return {
      date: r.date.slice(5),
      totalMessages: r.baseMetrics.totalMessages,
      activeSpeakers: r.baseMetrics.activeSpeakers,
      participationRate: participationRate,
      top20Percentage: r.baseMetrics.top20Percentage,
      avgMessagesPerSpeaker: avgMessagesPerSpeaker,
      totalMembers: r.baseMetrics.totalMembers,
    };
  }).reverse();

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild className="rounded-xl">
          <Link to="/groups">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <div className="p-1 rounded bg-blue-50 text-blue-600">
                <Users className="h-3.5 w-3.5" />
              </div>
              {group.memberCount} 成员
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <div className="p-1 rounded bg-purple-50 text-purple-600">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              创建于 {group.createdAt}
            </span>
          </div>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Excluded from Analysis Notice */}
      {group.isExcludedFromScoring && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-blue-50 border border-blue-200">
          <div className="p-2 rounded-lg bg-blue-100">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700">
            此群聊已配置为不参与分析，但基础指标仍正常统计。
          </p>
        </div>
      )}

      {/* AI Analysis Panel */}
      <div className="mb-6">
        <AIAnalysisPanel insight={latestReport.aiInsight} date={latestReport.date} />
      </div>

      {/* Base Metrics - Full Width */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="section-title text-lg font-semibold !mb-0">基础指标</h3>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">点击指标查看趋势</span>
        </div>
        <BaseMetricsDisplay
          totalMessages={latestReport.baseMetrics.totalMessages}
          totalMembers={latestReport.baseMetrics.totalMembers}
          activeSpeakers={latestReport.baseMetrics.activeSpeakers}
          top20Percentage={latestReport.baseMetrics.top20Percentage}
          selectedMetric={selectedMetric}
          onMetricSelect={setSelectedMetric}
        />
      </div>

      {/* Metric Trend Chart */}
      <div className="mb-6">
        <MetricTrendChart data={metricTrendData} selectedMetric={selectedMetric} />
      </div>

      {/* Member Ranking + Message Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberRanking members={latestReport.memberStats} />
        <MessageTypeChart data={latestReport.messageTypes} />
      </div>
    </div>
  );
}
