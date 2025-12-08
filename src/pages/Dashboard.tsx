import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { ActivityChart } from '@/components/ActivityChart';
import { mockChatGroups } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    // 默认选择昨日
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { from: yesterday, to: yesterday };
  });

  const stats = useMemo(() => {
    const totalMessages = mockChatGroups.reduce((acc, g) => acc + g.todayMessages, 0);
    const totalMembers = mockChatGroups.reduce((acc, g) => acc + g.memberCount, 0);
    const totalActiveSpeakers = Math.round(mockChatGroups.reduce((acc, g) => {
      return acc + Math.floor(g.memberCount * 0.6);
    }, 0));

    return { totalMessages, totalMembers, totalActiveSpeakers };
  }, []);

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
