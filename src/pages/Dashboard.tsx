import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { ActivityChart } from '@/components/ActivityChart';
import { mockChatGroups } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    // 默认选择昨日
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { from: yesterday, to: yesterday };
  });

  const stats = useMemo(() => {
    // 计算选择的日期范围天数
    const diffDays = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // 根据日期范围计算消息数（模拟：天数越多，消息越多）
    const baseMessages = mockChatGroups.reduce((acc, g) => acc + g.todayMessages, 0);
    const totalMessages = Math.round(baseMessages * diffDays * (0.8 + Math.random() * 0.4));

    // 总成员数不随日期变化
    const totalMembers = mockChatGroups.reduce((acc, g) => acc + g.memberCount, 0);

    // 发言人数根据日期范围变化（模拟：天数越多，累计发言人数越多，但有上限）
    const baseActiveSpeakers = Math.round(mockChatGroups.reduce((acc, g) => {
      return acc + Math.floor(g.memberCount * 0.6);
    }, 0));
    // 日期范围越大，发言人数越接近总成员数（因为更多人有机会发言）
    const speakerRatio = Math.min(0.6 + diffDays * 0.05, 0.95);
    const totalActiveSpeakers = Math.round(totalMembers * speakerRatio);

    return { totalMessages, totalMembers, totalActiveSpeakers };
  }, [dateRange]);

  const trendData = useMemo(() => {
    const diffDays = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    // 消息趋势最少展示7天数据
    const minDays = 7;
    const days = Math.max(diffDays, minDays - 1);

    // 以选择的结束日期为终点，往前推算
    const endDate = new Date(dateRange.to);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    return Array.from({ length: days + 1 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        messages: Math.floor(Math.random() * 300) + 200,
      };
    });
  }, [dateRange]);

  const sortedGroups = [...mockChatGroups].sort((a, b) => b.todayMessages - a.todayMessages);

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">数据总览</h1>
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
                    数据总览页面 - 逻辑说明
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6 text-sm">
                    {/* 页面概述 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📋 页面概述</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        数据总览页面是系统的首页入口，提供企业群聊的整体数据概览和关键指标展示，帮助用户快速了解群聊活跃状况。
                      </p>
                    </section>

                    {/* 字段定义 */}
                    <section>
                      <h3 className="font-semibold text-base mb-3 text-foreground">📊 字段定义</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">群聊总数</div>
                          <div className="text-muted-foreground mt-1">当前系统中所有群聊的数量总和，包含活跃和不活跃的群聊。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">总成员数</div>
                          <div className="text-muted-foreground mt-1">所有群聊中的成员数量累计（注：同一用户在多个群聊中会被重复计算）。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">总消息数</div>
                          <div className="text-muted-foreground mt-1">在选定日期范围内，所有群聊产生的消息数量总和。</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground">发言人数</div>
                          <div className="text-muted-foreground mt-1">在选定日期范围内，至少发送过一条消息的成员数量（按人次统计）。</div>
                        </div>
                      </div>
                    </section>

                    {/* 日期筛选逻辑 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📅 日期筛选逻辑</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>默认选择"昨日"作为初始日期范围</li>
                        <li>支持快捷选项：今日、昨日、近7天、近30天</li>
                        <li>支持自定义日期区间选择</li>
                        <li>日期变更后，所有数据卡片和图表同步刷新</li>
                      </ul>
                    </section>

                    {/* 消息趋势图 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">📈 消息趋势图</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>展示选定日期范围内的每日消息量变化</li>
                        <li>最少展示 7 天数据，确保趋势可读性</li>
                        <li>X 轴：日期（月/日格式）</li>
                        <li>Y 轴：消息数量</li>
                        <li>支持鼠标悬停查看具体数值</li>
                      </ul>
                    </section>

                    {/* 消息排行 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🏆 消息排行</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>展示今日消息量 Top 6 的群聊</li>
                        <li>排序规则：按今日消息数降序排列</li>
                        <li>前 3 名使用特殊徽章样式（金/银/铜）</li>
                        <li>点击群聊可跳转至群聊详情页</li>
                        <li>点击"全部"可跳转至群聊管理列表页</li>
                      </ul>
                    </section>

                    {/* 交互说明 */}
                    <section>
                      <h3 className="font-semibold text-base mb-2 text-foreground">🖱️ 交互说明</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>数据卡片：展示静态数据，无交互</li>
                        <li>趋势图：支持 hover 查看详细数值</li>
                        <li>排行列表：hover 高亮 + 点击跳转详情</li>
                        <li>日期选择器：下拉选择或自定义区间</li>
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
          <p className="text-muted-foreground">企业群聊数据分析与洞察</p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="群聊总数"
          value={mockChatGroups.length}
          icon={MessageSquare}
          delay={0}
        />
        <StatCard
          title="总成员数"
          value={stats.totalMembers}
          icon={Users}
          delay={50}
        />
        <StatCard
          title="总消息数"
          value={stats.totalMessages}
          icon={TrendingUp}
          delay={100}
        />
        <StatCard
          title="发言人数"
          value={stats.totalActiveSpeakers}
          icon={Users}
          delay={150}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <ActivityChart data={trendData} />
        </div>

        {/* Group Rankings */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold">消息排行</h3>
              <p className="text-sm text-muted-foreground mt-0.5">今日活跃群聊</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-primary hover:text-primary hover:bg-primary/10">
              <Link to="/groups">
                全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {sortedGroups.slice(0, 6).map((group, index) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
              >
                <span className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110',
                  index === 0 && 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm',
                  index === 1 && 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm',
                  index === 2 && 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-sm',
                  index > 2 && 'bg-muted text-muted-foreground'
                )}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.memberCount} 成员</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-lg font-bold text-foreground">
                      {group.todayMessages}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
