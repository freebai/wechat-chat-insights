import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Clock, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockChatGroups } from '@/lib/mockData';

const PAGE_SIZE = 10;

export default function Groups() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredGroups = useMemo(() => {
    return mockChatGroups.filter(group => {
      return group.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  const totalPages = Math.ceil(filteredGroups.length / PAGE_SIZE);
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGroups.slice(start, start + PAGE_SIZE);
  }, [filteredGroups, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FolderOpen className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">群聊管理</h1>
          </div>
          <p className="text-muted-foreground">管理和查看所有群聊数据</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索群聊名称..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-11 bg-card border-border"
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">群聊名称</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">群主</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">成员数</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">最近一次分析时间</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGroups.map((group, index) => (
              <tr
                key={group.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="py-4 px-6">
                  <span className="font-medium">{group.name}</span>
                  {group.isExcludedFromScoring && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">不参与分析</span>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">
                  {group.owner || '--'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">{group.memberCount}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{group.lastAnalysisTime}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Link to={`/groups/${group.id}`}>
                      查看详情
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">暂无群聊数据</p>
            <p className="text-sm text-muted-foreground/70 mt-1">尝试调整搜索条件</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <span className="text-sm text-muted-foreground">
              共 <span className="font-medium text-foreground">{filteredGroups.length}</span> 个群聊
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1"
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
