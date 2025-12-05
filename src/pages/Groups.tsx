import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, MessageSquare, Clock, AlertTriangle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockChatGroups, getScoreLevel } from '@/lib/mockData';
import { cn } from '@/lib/utils';

// 评分等级筛选选项
const scoreLevelOptions = [
  { value: 'all', label: '全部等级', min: 0, max: 100 },
  { value: 'excellent', label: '优秀', min: 90, max: 100 },
  { value: 'good', label: '良好', min: 70, max: 89 },
  { value: 'average', label: '一般', min: 50, max: 69 },
  { value: 'poor', label: '较差', min: 30, max: 49 },
  { value: 'warning', label: '预警', min: 0, max: 29 },
];

const PAGE_SIZE = 10;

export default function Groups() {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // 筛选逻辑
  const filteredGroups = useMemo(() => {
    return mockChatGroups.filter(group => {
      // 搜索匹配
      const searchMatch = group.name.toLowerCase().includes(search.toLowerCase());

      // 等级匹配
      const levelOption = scoreLevelOptions.find(opt => opt.value === selectedLevel);
      const levelMatch = levelOption
        ? group.latestScore >= levelOption.min && group.latestScore <= levelOption.max
        : true;

      return searchMatch && levelMatch;
    });
  }, [search, selectedLevel]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredGroups.length / PAGE_SIZE);
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGroups.slice(start, start + PAGE_SIZE);
  }, [filteredGroups, currentPage]);

  // 筛选变化时重置页码
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setCurrentPage(1);
  };

  const warningCount = mockChatGroups.filter(g => g.status === 'warning' || g.status === 'critical').length;

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">群聊管理</h1>
          <p className="text-muted-foreground mt-1">管理和监控所有群聊的健康状态</p>
        </div>
        {warningCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{warningCount} 个群聊需要关注</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索群聊..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLevel} onValueChange={handleLevelChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="评分等级" />
          </SelectTrigger>
          <SelectContent>
            {scoreLevelOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Groups Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">群聊名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">成员数</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">今日消息</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">健康分</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">最后分析</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGroups.map((group) => {
              const level = getScoreLevel(group.latestScore);

              return (
                <tr key={group.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.name}</span>
                        {group.isExcludedFromScoring && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            不参与评分
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{group.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{group.memberCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{group.todayMessages}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {(() => {
                      const isInsufficientData = group.riskStatus?.isNewGroup || group.riskStatus?.isMicroGroup;

                      if (isInsufficientData) {
                        // 构建 tooltip 内容
                        const reasons: string[] = [];
                        if (group.riskStatus?.isNewGroup) reasons.push('消息不足5条');
                        if (group.riskStatus?.isMicroGroup) reasons.push('成员少于3人');
                        const tooltipText = reasons.join('，');

                        return (
                          <div className="flex items-center gap-2" title={tooltipText}>
                            <span className="font-semibold text-muted-foreground">--</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              数据不足
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <span className={cn('font-semibold', level.color)}>{group.latestScore}</span>
                          <span className={cn('text-xs px-2 py-0.5 rounded', level.bgColor, level.color)}>
                            {level.label}
                          </span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{group.lastAnalysisTime}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/groups/${group.id}`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无群聊数据</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              共 {filteredGroups.length} 个群聊，第 {currentPage} / {totalPages} 页
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
