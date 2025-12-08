import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { ActivityChart } from '@/components/ActivityChart';
import { mockChatGroups } from '@/lib/mockData';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return { from, to };
  });

  const stats = useMemo(() => {
    const totalMessages = mockChatGroups.reduce((acc, g) => acc + g.todayMessages, 0);
    const totalMembers = mockChatGroups.reduce((acc, g) => acc + g.memberCount, 0);
    // 计算总发言人数（需要从报告数据中获取，这里用成员数的平均参与率估算）
    const totalActiveSpeakers = Math.round(mockChatGroups.reduce((acc, g) => {
      // 估算每个群的活跃发言人数为成员数的60%
      return acc + Math.floor(g.memberCount * 0.6);
    }, 0));

    return { totalMessages, totalMembers, totalActiveSpeakers };
  }, []);

  const trendData = useMemo(() => {
    const days = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return Array.from({ length: days + 1 }, (_, i) => {
      const date = new Date(dateRange.from);
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
          <h1 className="text-2xl font-bold">数据总览</h1>
          <p className="text-muted-foreground mt-1">企业群聊数据分析</p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          title="今日消息"
          value={stats.totalMessages}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
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
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">消息数排行</h3>
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/groups">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {sortedGroups.slice(0, 6).map((group, index) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.memberCount} 成员</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">
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
