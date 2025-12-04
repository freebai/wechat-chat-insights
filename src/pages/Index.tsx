import { MessageSquare, Users, TrendingUp, Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { MemberRanking } from '@/components/MemberRanking';
import { ActivityChart } from '@/components/ActivityChart';
import { HourlyHeatmap } from '@/components/HourlyHeatmap';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { MessageTypeChart } from '@/components/MessageTypeChart';
import {
  mockStats,
  mockMemberStats,
  mockDailyTrend,
  mockHourlyActivity,
  mockAIInsight,
  mockMessageTypes,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "功能开发中",
      description: "上传存档功能即将上线，敬请期待！",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "数据已刷新",
      description: "已获取最新的群聊数据",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 pb-12">
        <Header onUpload={handleUpload} onRefresh={handleRefresh} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="总消息数"
            value={mockStats.totalMessages}
            icon={MessageSquare}
            trend={{ value: 12.5, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="群成员数"
            value={mockStats.totalMembers}
            icon={Users}
            trend={{ value: 3.2, isPositive: true }}
            delay={50}
          />
          <StatCard
            title="日均消息"
            value={mockStats.avgMessagesPerDay}
            icon={TrendingUp}
            trend={{ value: 8.1, isPositive: true }}
            delay={100}
          />
          <StatCard
            title="活跃率"
            value={`${mockStats.activeRatio}%`}
            icon={Zap}
            trend={{ value: 2.3, isPositive: false }}
            delay={150}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityChart data={mockDailyTrend} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HourlyHeatmap data={mockHourlyActivity} />
              <MessageTypeChart data={mockMessageTypes} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <MemberRanking members={mockMemberStats} />
            <AIAnalysisPanel insight={mockAIInsight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
