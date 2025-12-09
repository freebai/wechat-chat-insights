import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Clock, ChevronLeft, ChevronRight, FolderOpen, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockChatGroups } from '@/lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
                    群聊管理页面 - 逻辑说明
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6 text-sm">
                    {/* 页面概述 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📋 页面概述</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        群聊管理页面展示所有企业群聊的列表视图，支持搜索筛选和分页浏览，可以快速查看群聊基本信息并跳转到详情页面。
                      </p>
                    </section>

                    {/* 字段定义 */}
                    <section>
                      <h3 className="font-semibold text-base mb-3 text-foreground">📊 字段定义</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">群聊名称</div>
                          <div className="text-muted-foreground mt-1">群聊的名称，来源于企业微信。带有"不参与分析"标签的群聊将不会进行 AI 分析。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">群主</div>
                          <div className="text-muted-foreground mt-1">群聊的创建者或管理员名称，如未设置则显示"--"。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">成员数</div>
                          <div className="text-muted-foreground mt-1">当前群聊中的总成员数量，实时更新。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">最近一次分析时间</div>
                          <div className="text-muted-foreground mt-1">该群聊最后进行 AI 分析的时间，格式为"YYYY-MM-DD HH:mm"。</div>
                        </div>
                      </div>
                    </section>

                    {/* 搜索筛选逻辑 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🔍 搜索筛选逻辑</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>支持按群聊名称模糊搜索（不区分大小写）</li>
                        <li>搜索结果实时更新，无需手动提交</li>
                        <li>搜索时自动重置到第一页</li>
                      </ul>
                    </section>

                    {/* 分页逻辑 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📄 分页逻辑</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>每页显示 10 条记录</li>
                        <li>底部显示总群聊数和分页导航</li>
                        <li>支持直接点击页码跳转</li>
                        <li>最多显示 5 个页码按钮</li>
                      </ul>
                    </section>

                    {/* 交互说明 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🖱️ 交互说明</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>表格行：hover 高亮显示</li>
                        <li>查看详情：点击跳转到群聊详情页面</li>
                        <li>不参与分析标签：灰色标签，表示该群聊已被排除在 AI 分析之外</li>
                      </ul>
                    </section>

                    {/* 开发注意事项 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">⚠️ 开发注意事项</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>当前使用 Mock 数据，后续需对接真实 API</li>
                        <li>需处理数据加载状态和错误状态</li>
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
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
