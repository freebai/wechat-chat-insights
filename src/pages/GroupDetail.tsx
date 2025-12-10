import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Calendar, Info, BarChart3, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockChatGroups, generateMockReports } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { MemberRanking } from '@/components/MemberRanking';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { MessageTypeChart } from '@/components/MessageTypeChart';
import { HourlyMessageChart } from '@/components/HourlyMessageChart';
import { BaseMetricsDisplay, MetricKey } from '@/components/BaseMetricsDisplay';
import { MetricTrendChart } from '@/components/MetricTrendChart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// 报告列表上下文类型
interface ReportListItem {
  id: string;
  groupId: string;
  groupName: string;
  date: string;
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const group = mockChatGroups.find(g => g.id === id);

  // 检查是否从分析记录页面进入
  const fromReports = searchParams.get('fromReports') === 'true';
  const reportId = searchParams.get('reportId');

  // 从 sessionStorage 获取报告列表上下文
  const [reportListContext, setReportListContext] = useState<ReportListItem[]>([]);
  const [currentReportIndex, setCurrentReportIndex] = useState(-1);

  useEffect(() => {
    if (fromReports && reportId) {
      const stored = sessionStorage.getItem('reportListContext');
      if (stored) {
        try {
          const list: ReportListItem[] = JSON.parse(stored);
          setReportListContext(list);
          const index = list.findIndex(r => r.id === reportId);
          setCurrentReportIndex(index);
        } catch {
          // 解析失败，忽略
        }
      }
    }
  }, [fromReports, reportId]);

  // 切换到上一个/下一个报告
  const handlePrevReport = () => {
    if (currentReportIndex > 0) {
      const prevReport = reportListContext[currentReportIndex - 1];
      navigate(`/groups/${prevReport.groupId}?reportId=${prevReport.id}&fromReports=true`);
    }
  };

  const handleNextReport = () => {
    if (currentReportIndex < reportListContext.length - 1) {
      const nextReport = reportListContext[currentReportIndex + 1];
      navigate(`/groups/${nextReport.groupId}?reportId=${nextReport.id}&fromReports=true`);
    }
  };

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    // 默认选择昨日
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { from: yesterday, to: yesterday };
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

  // 趋势数据：从分析记录进入时基于报告日期往前推7天，否则基于日期选择器
  const trendReports = useMemo(() => {
    let endDate: Date;
    if (fromReports && reportId) {
      // 从分析记录进入：使用当前报告的日期
      const targetReport = reports.find(r => r.id === reportId);
      endDate = targetReport ? new Date(targetReport.date) : dateRange.to;
    } else {
      endDate = dateRange.to;
    }

    const from = new Date(endDate);
    from.setDate(from.getDate() - 7);
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= from && reportDate <= endDate;
    });
  }, [reports, dateRange, fromReports, reportId]);

  // 从群聊管理进入时，用于追踪选中的AI分析日期
  const [selectedAnalysisDate, setSelectedAnalysisDate] = useState<string | null>(null);

  // 获取日期范围内可用的AI分析日期列表（排序：最新在前）
  const availableAnalysisDates = useMemo(() => {
    return filteredReports.map(r => r.date).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [filteredReports]);

  // 当筛选条件变化时，重置选中日期为昨日
  useEffect(() => {
    if (!fromReports && availableAnalysisDates.length > 0) {
      // 获取昨日日期字符串
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // 如果昨日在可用日期中，选择昨日；否则设为 null（展示空状态）
      if (availableAnalysisDates.includes(yesterdayStr)) {
        setSelectedAnalysisDate(yesterdayStr);
      } else {
        setSelectedAnalysisDate(null);
      }
    }
  }, [fromReports, availableAnalysisDates]);


  // 获取当前展示的报告
  const currentReport = useMemo(() => {
    if (reportId) {
      // 从分析记录进入：使用指定的 reportId
      const found = reports.find(r => r.id === reportId);
      if (found) return found;
    }
    if (!fromReports && selectedAnalysisDate) {
      // 从群聊管理进入：使用选中的日期
      const found = filteredReports.find(r => r.date === selectedAnalysisDate);
      if (found) return found;
    }
    // 默认返回筛选后的第一个（用于基础指标展示）
    return filteredReports[0] || reports[0];
  }, [reportId, reports, filteredReports, fromReports, selectedAnalysisDate]);

  // 用于AI分析的报告（只有选择日期时才有）
  const aiAnalysisReport = useMemo(() => {
    if (fromReports && reportId) {
      return reports.find(r => r.id === reportId);
    }
    if (!fromReports && selectedAnalysisDate) {
      return filteredReports.find(r => r.date === selectedAnalysisDate);
    }
    return undefined;
  }, [fromReports, reportId, selectedAnalysisDate, reports, filteredReports]);

  if (!group) {
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

  // 当前报告在列表中的信息
  const currentListItem = reportListContext[currentReportIndex];
  const showNavigator = fromReports && reportListContext.length > 0 && currentReportIndex >= 0;

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild className="rounded-xl">
          <Link to={fromReports ? "/reports" : "/groups"}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs gap-1 border-dashed text-muted-foreground hover:text-primary hover:border-primary"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  逻辑说明
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    分析详情页 - 逻辑说明
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6 text-sm">
                    {/* 入口说明 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📋 当前入口</h3>
                      <div className={`p-3 rounded-lg ${fromReports ? 'bg-purple-50 border border-purple-200' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className={`font-medium ${fromReports ? 'text-purple-700' : 'text-blue-700'}`}>
                          {fromReports ? '从「分析记录」进入' : '从「群聊管理」进入'}
                        </div>
                        <div className={`mt-1 ${fromReports ? 'text-purple-600' : 'text-blue-600'}`}>
                          {fromReports
                            ? '固定查看特定日期的分析报告，可通过导航切换不同记录。'
                            : '可自由切换日期范围，查看不同时间段的基础指标和AI分析。'}
                        </div>
                      </div>
                    </section>

                    {/* 页面结构 */}
                    <section>
                      <h3 className="font-semibold text-base mb-3 text-foreground">🏗️ 页面结构</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">AI智能分析</div>
                          <div className="text-muted-foreground mt-1">
                            展示AI对群聊内容的分析结果，包括话题摘要、情感分析、关键洞察等。
                            {fromReports
                              ? '当前固定展示进入时指定的报告日期。'
                              : '可通过日期选择切换查看不同日期的分析。'}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">基础指标</div>
                          <div className="text-muted-foreground mt-1">总消息数、成员数、发言人数、Top20%发言占比。点击指标卡片可查看对应的趋势图表。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">指标趋势图</div>
                          <div className="text-muted-foreground mt-1">展示选中指标近7天的变化趋势，帮助了解群聊活跃度的变化情况。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">成员消息数排名</div>
                          <div className="text-muted-foreground mt-1">按消息数量排序的成员列表，展示最活跃的发言者。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">消息类型分布</div>
                          <div className="text-muted-foreground mt-1">展示各类型消息（文本、图片、文件等）的数量占比分布。</div>
                        </div>
                      </div>
                    </section>

                    {/* 入口差异说明 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🔀 两种入口的差异</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 font-medium text-foreground">功能项</th>
                              <th className="text-left py-2 px-3 font-medium text-foreground">群聊管理入口</th>
                              <th className="text-left py-2 px-3 font-medium text-foreground">分析记录入口</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                              <td className="py-2 px-3">日期选择器</td>
                              <td className="py-2 px-3">✅ 显示，可自由切换</td>
                              <td className="py-2 px-3">❌ 不显示</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="py-2 px-3">记录导航</td>
                              <td className="py-2 px-3">❌ 不显示</td>
                              <td className="py-2 px-3">✅ 显示上/下一个</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="py-2 px-3">AI分析日期</td>
                              <td className="py-2 px-3">默认昨日，可切换</td>
                              <td className="py-2 px-3">固定为进入时的日期</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="py-2 px-3">返回链接</td>
                              <td className="py-2 px-3">返回群聊管理</td>
                              <td className="py-2 px-3">返回分析记录</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-3">趋势图基准</td>
                              <td className="py-2 px-3">基于日期选择器结束日期</td>
                              <td className="py-2 px-3">基于当前报告日期</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* 交互说明 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🖱️ 交互说明</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>基础指标卡片：点击可切换趋势图展示的指标</li>
                        <li>成员消息数排名：展示成员类型标签</li>
                        <li>消息类型：hover 显示详细数量</li>
                        {fromReports && <li>记录导航：点击上/下一个切换分析记录</li>}
                        {!fromReports && <li>AI分析日期：下拉选择查看不同日期的分析</li>}
                      </ul>
                    </section>

                    {/* 开发注意事项 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">⚠️ 开发注意事项</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>当前使用 Mock 数据，后续需对接真实 API</li>
                        <li>需处理数据加载状态和错误状态</li>
                        <li>从分析记录进入时，记录列表存储在 sessionStorage</li>
                        <li>URL参数 fromReports=true 标识入口来源</li>
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
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
        {!fromReports && (
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        )}
      </div>

      {/* Excluded from Analysis Notice */}
      {group.isExcludedFromScoring && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-blue-50 border border-blue-200">
          <div className="p-2 rounded-lg bg-blue-100">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700">
            此群聊已配置为不参与AI分析。
          </p>
        </div>
      )}

      {/* Report Navigation - 只有从分析记录页面进入时才显示 */}
      {showNavigator && (
        <div className="mb-6 flex items-center justify-between bg-card rounded-xl p-4 border border-border shadow-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevReport}
            disabled={currentReportIndex <= 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            上一个记录
          </Button>
          <div className="text-center">
            <div className="text-sm font-medium">
              {currentListItem?.groupName} · {currentListItem?.date}
            </div>
            <span className="text-xs text-muted-foreground">
              ({currentReportIndex + 1} / {reportListContext.length})
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextReport}
            disabled={currentReportIndex >= reportListContext.length - 1}
            className="gap-1"
          >
            下一个记录
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* AI Analysis Panel */}
      <div className="mb-6">
        {(() => {
          // 判断群是否参与分析以及是否满足分析门槛
          const isExcluded = group.isExcludedFromScoring;
          const isInsufficient = group.riskStatus?.isNewGroup || group.riskStatus?.isMicroGroup;
          const hasNoData = !fromReports && !aiAnalysisReport;

          // 确定空状态原因
          let emptyReason: 'excluded' | 'insufficient' | 'no_data' = 'no_data';
          if (isExcluded) {
            emptyReason = 'excluded';
          } else if (isInsufficient) {
            emptyReason = 'insufficient';
          }

          const shouldShowEmpty = isExcluded || isInsufficient || hasNoData;

          return (
            <AIAnalysisPanel
              insight={shouldShowEmpty ? undefined : aiAnalysisReport?.aiInsight}
              date={aiAnalysisReport?.date || selectedAnalysisDate || undefined}
              showDatePicker={!fromReports}
              availableDates={availableAnalysisDates}
              onDateChange={setSelectedAnalysisDate}
              isEmpty={shouldShowEmpty}
              emptyReason={emptyReason}
            />
          );
        })()}
      </div>

      {/* Base Metrics - Full Width */}
      {currentReport && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title text-lg font-semibold !mb-0">基础指标</h3>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">点击指标查看趋势</span>
          </div>
          <BaseMetricsDisplay
            totalMessages={currentReport.baseMetrics.totalMessages}
            totalMembers={currentReport.baseMetrics.totalMembers}
            activeSpeakers={currentReport.baseMetrics.activeSpeakers}
            top20Percentage={currentReport.baseMetrics.top20Percentage}
            selectedMetric={selectedMetric}
            onMetricSelect={setSelectedMetric}
          />
        </div>
      )}

      {/* Metric Trend Chart */}
      {currentReport && (
        <div className="mb-6">
          <MetricTrendChart data={metricTrendData} selectedMetric={selectedMetric} />
        </div>
      )}

      {/* Member Ranking + Message Type */}
      {currentReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemberRanking members={currentReport.memberStats} />
          <MessageTypeChart data={currentReport.messageTypes} />
        </div>
      )}

      {/* 24小时消息分布折线图 */}
      {currentReport && (
        <div className="mt-6">
          <HourlyMessageChart data={currentReport.hourlyActivity} />
        </div>
      )}
    </div>
  );
}
