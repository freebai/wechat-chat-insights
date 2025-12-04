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

// Scoring system interfaces
export interface ScoreBreakdown {
  avgMessagesPerMember: number; // 人均消息数
  speakerPenetration: number; // 发言渗透率 (0-100)
  interactionDensity: number; // 互动密度 (0-100)
  avgMessagesPerSpeaker: number; // 发言者人均消息数
}

export interface AnalysisReport {
  id: string;
  groupId: string;
  date: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  messageCount: number;
  activeMembers: number;
  aiInsight: AIInsight;
  memberStats: MemberStats[];
  hourlyActivity: HourlyActivity[];
  messageTypes: { type: string; count: number; percentage: number }[];
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  latestScore: number;
  scoreBreakdown: ScoreBreakdown;
  todayMessages: number;
  lastAnalysisTime: string;
  status: 'healthy' | 'warning' | 'critical';
}

// Score level definitions
export const getScoreLevel = (score: number): { label: string; color: string; bgColor: string } => {
  if (score >= 90) return { label: '优秀', color: 'text-primary', bgColor: 'bg-primary/20' };
  if (score >= 70) return { label: '良好', color: 'text-blue-400', bgColor: 'bg-blue-400/20' };
  if (score >= 50) return { label: '一般', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
  if (score >= 30) return { label: '较差', color: 'text-orange-400', bgColor: 'bg-orange-400/20' };
  return { label: '预警', color: 'text-destructive', bgColor: 'bg-destructive/20' };
};

// Scoring dimension definitions
export const scoreDimensions = {
  avgMessagesPerMember: {
    name: '人均消息数',
    description: '总消息数除以群成员总数，反映群组整体活跃度',
    weight: 0.25,
    formula: '总消息数 / 群成员总数',
  },
  speakerPenetration: {
    name: '发言渗透率',
    description: '发言人数占群成员总数的比例，反映成员参与广度',
    weight: 0.25,
    formula: '(发言人数 / 群成员总数) × 100',
  },
  interactionDensity: {
    name: '互动密度',
    description: '互动次数与总消息数的比值，反映成员间的互动频率',
    weight: 0.25,
    formula: '(互动次数 / 总消息数) × 100',
  },
  avgMessagesPerSpeaker: {
    name: '发言者人均消息数',
    description: '总消息数除以发言人数，反映发言者的活跃程度',
    weight: 0.25,
    formula: '消息总数 / 发言人数',
  },
};

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

// Mock chat groups
export const mockChatGroups: ChatGroup[] = [
  {
    id: '1',
    name: '产品研发群',
    description: '产品与研发团队日常沟通',
    memberCount: 45,
    createdAt: '2024-01-15',
    latestScore: 87,
    scoreBreakdown: { avgMessagesPerMember: 3.5, speakerPenetration: 85, interactionDensity: 88, avgMessagesPerSpeaker: 4.8 },
    todayMessages: 156,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
  },
  {
    id: '2',
    name: '销售运营群',
    description: '销售与运营团队协作',
    memberCount: 32,
    createdAt: '2024-02-20',
    latestScore: 72,
    scoreBreakdown: { avgMessagesPerMember: 2.8, speakerPenetration: 65, interactionDensity: 75, avgMessagesPerSpeaker: 3.9 },
    todayMessages: 89,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
  },
  {
    id: '3',
    name: '客服支持群',
    description: '客户服务与技术支持',
    memberCount: 28,
    createdAt: '2024-03-10',
    latestScore: 45,
    scoreBreakdown: { avgMessagesPerMember: 8.4, speakerPenetration: 38, interactionDensity: 42, avgMessagesPerSpeaker: 22.0 },
    todayMessages: 234,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'warning',
  },
  {
    id: '4',
    name: '市场推广群',
    description: '市场营销活动策划',
    memberCount: 18,
    createdAt: '2024-04-05',
    latestScore: 91,
    scoreBreakdown: { avgMessagesPerMember: 3.7, speakerPenetration: 88, interactionDensity: 92, avgMessagesPerSpeaker: 4.2 },
    todayMessages: 67,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
  },
  {
    id: '5',
    name: '财务行政群',
    description: '财务与行政事务协调',
    memberCount: 15,
    createdAt: '2024-05-18',
    latestScore: 28,
    scoreBreakdown: { avgMessagesPerMember: 0.8, speakerPenetration: 22, interactionDensity: 35, avgMessagesPerSpeaker: 3.6 },
    todayMessages: 12,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'critical',
  },
  {
    id: '6',
    name: '高管决策群',
    description: '公司高层决策讨论',
    memberCount: 8,
    createdAt: '2024-01-01',
    latestScore: 68,
    scoreBreakdown: { avgMessagesPerMember: 2.9, speakerPenetration: 78, interactionDensity: 72, avgMessagesPerSpeaker: 3.7 },
    todayMessages: 23,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
  },
];

// Generate mock analysis reports for a group
export const generateMockReports = (groupId: string, days: number = 30): AnalysisReport[] => {
  const group = mockChatGroups.find(g => g.id === groupId);
  if (!group) return [];

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const baseScore = group.latestScore + (Math.random() - 0.5) * 20;
    const score = Math.max(0, Math.min(100, Math.round(baseScore)));

    return {
      id: `${groupId}-${dateStr}`,
      groupId,
      date: dateStr,
      overallScore: score,
      scoreBreakdown: {
        avgMessagesPerMember: Math.max(0.5, Math.min(10, 3 + (Math.random() - 0.5) * 4)),
        speakerPenetration: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 15))),
        interactionDensity: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 15))),
        avgMessagesPerSpeaker: Math.max(1, Math.min(20, 5 + (Math.random() - 0.5) * 10)),
      },
      messageCount: Math.floor(Math.random() * 200) + 50,
      activeMembers: Math.floor(Math.random() * group.memberCount * 0.8) + Math.floor(group.memberCount * 0.2),
      aiInsight: {
        ...mockAIInsight,
        summary: `${dateStr} 群聊分析：整体沟通状态${score >= 70 ? '良好' : score >= 50 ? '一般' : '需要关注'}，${score >= 70 ? '团队协作效率较高' : '建议增加互动频率'}。`,
      },
      memberStats: mockMemberStats.map(m => ({
        ...m,
        messageCount: Math.floor(m.messageCount * (0.8 + Math.random() * 0.4)),
      })),
      hourlyActivity: mockHourlyActivity.map(h => ({
        ...h,
        count: Math.floor(h.count * (0.7 + Math.random() * 0.6)),
      })),
      messageTypes: mockMessageTypes,
    };
  });
};
