import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, MessageSquare, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockChatGroups } from '@/lib/mockData';

const PAGE_SIZE = 10;

export default function Groups() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 筛选逻辑
  const filteredGroups = useMemo(() => {
    return mockChatGroups.filter(group => {
      // 搜索匹配
      return group.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

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

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">群聊管理</h1>
          <p className="text-muted-foreground mt-1">管理和查看所有群聊</p>
        </div>
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
      </div>

      {/* Groups Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">群聊名称</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">群主</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">成员数</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">今日消息</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">最后分析</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGroups.map((group) => (
              <tr key={group.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-medium">{group.name}</span>
                </td>
                <td className="py-4 px-6 text-sm">
                  {group.owner || '--'}
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
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{group.lastAnalysisTime}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link
                    to={`/groups/${group.id}`}
                    className="text-primary hover:text-primary/80 transition-colors text-sm"
                  >
                    查看
                  </Link>
                </td>
              </tr>
            ))}
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
