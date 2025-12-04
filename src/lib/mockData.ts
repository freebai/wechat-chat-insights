export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'link';
}

export interface MemberStats {
  name: string;
  messageCount: number;
  avatar?: string;
}

export interface HourlyActivity {
  hour: number;
  count: number;
}

export interface DailyTrend {
  date: string;
  messages: number;
}

export interface AIInsight {
  topics: { name: string; count: number; sentiment: 'positive' | 'neutral' | 'negative' }[];
  summary: string;
  sentiment: { positive: number; neutral: number; negative: number };
  keyHighlights: string[];
}

// Mock data
export const mockStats = {
  totalMessages: 12847,
  totalMembers: 156,
  avgMessagesPerDay: 428,
  activeRatio: 67.3,
};

export const mockMemberStats: MemberStats[] = [
  { name: '张经理', messageCount: 1256 },
  { name: '李工程师', messageCount: 987 },
  { name: '王产品', messageCount: 856 },
  { name: '刘设计', messageCount: 743 },
  { name: '陈运营', messageCount: 698 },
  { name: '赵销售', messageCount: 621 },
  { name: '周客服', messageCount: 589 },
  { name: '吴财务', messageCount: 456 },
];

export const mockHourlyActivity: HourlyActivity[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  count: Math.floor(Math.random() * 200) + (i >= 9 && i <= 18 ? 300 : 50),
}));

export const mockDailyTrend: DailyTrend[] = [
  { date: '11/25', messages: 387 },
  { date: '11/26', messages: 456 },
  { date: '11/27', messages: 512 },
  { date: '11/28', messages: 423 },
  { date: '11/29', messages: 489 },
  { date: '11/30', messages: 534 },
  { date: '12/01', messages: 478 },
  { date: '12/02', messages: 521 },
  { date: '12/03', messages: 467 },
  { date: '12/04', messages: 498 },
];

export const mockAIInsight: AIInsight = {
  topics: [
    { name: '项目进度', count: 234, sentiment: 'neutral' },
    { name: '产品优化', count: 189, sentiment: 'positive' },
    { name: '客户反馈', count: 156, sentiment: 'negative' },
    { name: '技术方案', count: 134, sentiment: 'positive' },
    { name: '市场活动', count: 98, sentiment: 'positive' },
  ],
  summary: '本周群内讨论主要围绕Q4项目收尾工作展开。团队对产品优化方案达成共识，技术团队提出了多项创新解决方案。客户反馈方面存在一些待解决问题，需要重点关注。整体沟通氛围积极，协作效率较高。',
  sentiment: { positive: 45, neutral: 38, negative: 17 },
  keyHighlights: [
    '项目A预计提前3天完成交付',
    '新功能用户满意度达92%',
    '需关注：3个客户投诉待处理',
    '下周一10:00全员会议',
  ],
};

export const mockMessageTypes = [
  { type: '文本消息', count: 9834, percentage: 76.5 },
  { type: '图片', count: 1567, percentage: 12.2 },
  { type: '文件', count: 892, percentage: 6.9 },
  { type: '链接', count: 554, percentage: 4.4 },
];
