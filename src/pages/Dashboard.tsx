import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { ActivityChart } from '@/components/ActivityChart';
import { mockChatGroups, generateMockReports, getScoreLevel } from '@/lib/mockData';
import { ScoreRing } from '@/components/common/ScoreRing';
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
    const avgScore = Math.round(mockChatGroups.reduce((acc, g) => acc + g.latestScore, 0) / mockChatGroups.length);
    const warningGroups = mockChatGroups.filter(g => g.status === 'warning' || g.status === 'critical');
    
    return { totalMessages, totalMembers, avgScore, warningGroups };
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

  const sortedGroups = [...mockChatGroups].sort((a, b) => b.latestScore - a.latestScore);

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">数据总览</h1>
          <p className="text-muted-foreground mt-1">企业群聊健康状态监控</p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Warning Banner */}
      {stats.warningGroups.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                {stats.warningGroups.length} 个群聊健康分较低
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.warningGroups.map(g => g.name).join('、')}
              </p>
            </div>
          </div>
          <Button variant="destructive" size="sm" asChild>
            <Link to="/groups">查看详情</Link>
          </Button>
        </div>
      )}

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
        <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">平均健康分</p>
              <p className="text-3xl font-semibold mt-2">{stats.avgScore}</p>
            </div>
            <ScoreRing score={stats.avgScore} size="sm" />
          </div>
        </div>
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
            <h3 className="text-lg font-semibold">群聊健康排行</h3>
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/groups">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {sortedGroups.slice(0, 6).map((group, index) => {
              const level = getScoreLevel(group.latestScore);
              return (
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
                    <span className={cn('text-lg font-semibold', level.color)}>
                      {group.latestScore}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
