import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockChatGroups, generateMockReports } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default function Reports() {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from, to };
  });
  const [currentPage, setCurrentPage] = useState(1);

  const allReports = useMemo(() => {
    return mockChatGroups.flatMap(group =>
      generateMockReports(group.id, 30).map(report => ({
        ...report,
        groupName: group.name,
      }))
    );
  }, []);

  const filteredReports = useMemo(() => {
    return allReports
      .filter(report => {
        const reportDate = new Date(report.date);
        const dateMatch = reportDate >= dateRange.from && reportDate <= dateRange.to;
        const groupMatch = selectedGroup === 'all' || report.groupId === selectedGroup;
        return dateMatch && groupMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allReports, dateRange, selectedGroup]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, currentPage]);

  // 筛选变化时重置页码
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value);
    setCurrentPage(1);
  };

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold">分析记录</h1>
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
                    分析记录页面 - 逻辑说明
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6 text-sm">
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📋 页面概述</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        本页面记录了系统对各群聊产生的每日深度分析报告。用户可以追溯历史记录并查看具体的 AI 总结和活跃指标。
                      </p>
                    </section>
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">⏱️ 报告生成机制</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><strong>定时生成</strong>：系统通常在每日凌晨对前一日的聊天数据进行汇总和 AI 分析。</li>
                        <li><strong>准入阈值</strong>：为了保证分析质量，消息量过少（如每日少于 10 条）或成员数过少的群聊可能不会产生当日分析报告。</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🔍 检索逻辑</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><strong>日期筛选</strong>：支持查看特定时间段内的所有报告。</li>
                        <li><strong>群聊联动</strong>：从本页面点击“查看详情”进入群聊详情时，将锁定查看该日期的特定报告。</li>
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">追溯和管理历史产生的 AI 智能分析报告</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedGroup} onValueChange={handleGroupChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="选择群聊" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部群聊</SelectItem>
            {mockChatGroups.map(group => (
              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
      </div>

      {/* Reports List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">日期</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">群聊</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">消息数</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">发言人数</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">摘要</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((report) => (
              <tr key={report.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{report.date}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium">{report.groupName}</span>
                </td>
                <td className="py-4 px-6 text-sm">{report.messageCount}</td>
                <td className="py-4 px-6 text-sm">{report.baseMetrics.activeSpeakers}</td>
                <td className="py-4 px-6">
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {report.aiInsight.summary.slice(0, 50)}...
                  </p>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link
                    to={`/groups/${report.groupId}?reportId=${report.id}&fromReports=true`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => {
                      // 存储当前筛选后的报告列表供详情页切换使用
                      const reportListData = filteredReports.map(r => ({
                        id: r.id,
                        groupId: r.groupId,
                        groupName: r.groupName,
                        date: r.date,
                      }));
                      sessionStorage.setItem('reportListContext', JSON.stringify(reportListData));
                    }}
                  >
                    查看详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无分析记录</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              共 {filteredReports.length} 条记录，第 {currentPage} / {totalPages} 页
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
