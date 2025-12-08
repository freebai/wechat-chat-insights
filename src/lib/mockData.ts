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

// Scoring system interfaces - v2.0 混合模型
// 统计类指标 (60% 权重)
export interface StatisticalMetrics {
  speakerPenetration: number;       // A. 发言渗透率 (0-100)
  avgMessagesPerSpeaker: number;    // B. 发言者人均消息数
  responseSpeedScore: number;       // C. 消息间隔分 (0-100, 根据中位数响应间隔计算)
  timeDistributionScore: number;    // D. 时间分布均匀度 (0-100)
}

// 语义类指标 (40% 权重)
export interface SemanticMetrics {
  topicRelevanceScore: number;      // E. 话题相关度 (0-100)
  atmosphereScore: number;          // F. 交互氛围分 (0-100)
}

// 综合评分分解 (六维)
export interface ScoreBreakdown {
  // 统计维度
  speakerPenetration: number;       // A. 发言渗透率
  avgMessagesPerSpeaker: number;    // B. 发言者人均消息数
  responseSpeedScore: number;       // C. 消息间隔分
  timeDistributionScore: number;    // D. 时间分布均匀度
  // 语义维度
  topicRelevanceScore: number;      // E. 话题相关度
  atmosphereScore: number;          // F. 交互氛围分
}

// 风险状态
export interface RiskStatus {
  isNewGroup: boolean;              // 冷启动标记 (消息数 < 5)
  isMicroGroup: boolean;            // 微型群标记 (成员 < 3)
  hasConflictRisk: boolean;         // 负分熔断触发 (氛围分 < 30)
  riskMessage?: string;
}

// 阈值配置
export interface ScoreThresholds {
  avgMessagesPerSpeakerTarget: number;  // 人均深度阈值，默认 20
  responseSpeedBase: number;            // 消息间隔基准(秒)，默认 300
  atmosphereMeltdownThreshold: number;  // 氛围熔断阈值，默认 30
  coldStartMessageThreshold: number;    // 冷启动消息阈值，默认 5
  microGroupMemberThreshold: number;    // 微型群人数阈值，默认 3
}

// 默认阈值配置
export const defaultThresholds: ScoreThresholds = {
  avgMessagesPerSpeakerTarget: 20,
  responseSpeedBase: 300,
  atmosphereMeltdownThreshold: 30,
  coldStartMessageThreshold: 5,
  microGroupMemberThreshold: 3,
};

// 群评分参与配置
export interface GroupScoringConfig {
  mode: 'all' | 'include' | 'exclude';  // 全部参与 | 仅指定参与 | 排除指定
  groupIds: string[];                   // 指定的群聊 ID 列表
}

// 默认群评分配置
export const defaultGroupScoringConfig: GroupScoringConfig = {
  mode: 'all',
  groupIds: [],
};

// 权重配置
export const scoreWeights = {
  statistical: {
    overall: 0.6,
    speakerPenetration: 0.35,
    avgMessagesPerSpeaker: 0.25,
    responseSpeedScore: 0.20,
    timeDistributionScore: 0.20,
  },
  semantic: {
    overall: 0.4,
    topicRelevanceScore: 0.70,
    atmosphereScore: 0.30,
  },
};

export interface AnalysisReport {
  id: string;
  groupId: string;
  date: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  messageCount: number;
  activeMembers: number;
  // 基础指标数据
  baseMetrics: {
    totalMessages: number;
    totalMembers: number;
    activeSpeakers: number;
    activeHours: number;
    totalHours: number;
    top20Percentage: number;
    medianResponseInterval: number;  // 消息间隔时间中位数(秒)
  };
  // 风险状态
  riskStatus: RiskStatus;
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
  riskStatus?: RiskStatus;
  isExcludedFromScoring?: boolean;  // 是否被排除评分（由配置决定）
  recentScores?: number[];  // 近期历史分数（用于计算平均值）
  owner?: string;  // 群主
  previousScore?: number;  // 上次分数（用于计算增减）
}

// Score level definitions
// Score level definitions
export const getScoreLevel = (score: number): { label: string; color: string; bgColor: string; borderColor: string } => {
  if (score >= 90) return { label: '优秀', color: 'text-primary', bgColor: 'bg-primary/20', borderColor: 'border-primary/30' };
  if (score >= 70) return { label: '良好', color: 'text-blue-400', bgColor: 'bg-blue-400/20', borderColor: 'border-blue-400/30' };
  if (score >= 50) return { label: '一般', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', borderColor: 'border-yellow-400/30' };
  if (score >= 30) return { label: '较差', color: 'text-orange-400', bgColor: 'bg-orange-400/20', borderColor: 'border-orange-400/30' };
  return { label: '预警', color: 'text-destructive', bgColor: 'bg-destructive/20', borderColor: 'border-destructive/30' };
};

// Scoring dimension definitions - v2.0 六维模型
export const scoreDimensions = {
  // 统计类指标 (60%)
  speakerPenetration: {
    name: '发言渗透率',
    description: '发言人数占群成员总数的比例，反映成员参与广度',
    weight: 0.35 * 0.6, // 21%
    formula: '(发言人数 / 群成员总数) × 100',
    category: 'statistical' as const,
  },
  avgMessagesPerSpeaker: {
    name: '发言者人均消息',
    description: '总消息数除以发言人数，反映发言者的活跃程度',
    weight: 0.25 * 0.6, // 15%
    formula: 'min(消息总数 / 发言人数 / 阈值, 1) × 100',
    category: 'statistical' as const,
  },
  responseSpeedScore: {
    name: '消息间隔分',
    description: '消息间隔时间中位数越短，分数越高',
    weight: 0.20 * 0.6, // 12%
    formula: '(1 - 消息间隔时间中位数 / 基准时间) × 100',
    category: 'statistical' as const,
  },
  timeDistributionScore: {
    name: '时间分布均匀度',
    description: '消息在时间轴上的分布均匀程度，反映群组持续活跃性',
    weight: 0.20 * 0.6, // 12%
    formula: '(活跃时段数 / 运营时段数) × 100',
    category: 'statistical' as const,
  },
  // 语义类指标 (40%)
  topicRelevanceScore: {
    name: '话题相关度',
    description: '消息内容与业务/产品的相关性，由 LLM 分析',
    weight: 0.70 * 0.4, // 28%
    formula: 'LLM 分析：业务探讨100分，闲聊/广告0分',
    category: 'semantic' as const,
  },
  atmosphereScore: {
    name: '交互氛围分',
    description: '群内情绪极性与冲突程度，由 LLM 分析',
    weight: 0.30 * 0.4, // 12%
    formula: 'LLM 分析：和谐互助100分，攻击辱骂0-40分',
    category: 'semantic' as const,
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

// Mock chat groups - v2.0 六维评分
export const mockChatGroups: ChatGroup[] = [
  {
    id: '1',
    name: '产品研发群',
    description: '产品与研发团队日常沟通',
    memberCount: 45,
    createdAt: '2024-01-15',
    latestScore: 87,
    scoreBreakdown: {
      speakerPenetration: 85,
      avgMessagesPerSpeaker: 75,
      responseSpeedScore: 82,
      timeDistributionScore: 78,
      topicRelevanceScore: 92,
      atmosphereScore: 88,
    },
    todayMessages: 156,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
    recentScores: [87, 85, 89, 86, 88, 87, 84],
    owner: '张经理',
    previousScore: 85,
  },
  {
    id: '2',
    name: '销售运营群',
    description: '销售与运营团队协作',
    memberCount: 32,
    createdAt: '2024-02-20',
    latestScore: 72,
    scoreBreakdown: {
      speakerPenetration: 65,
      avgMessagesPerSpeaker: 68,
      responseSpeedScore: 70,
      timeDistributionScore: 62,
      topicRelevanceScore: 78,
      atmosphereScore: 75,
    },
    todayMessages: 89,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
    recentScores: [72, 70, 74, 71, 73, 69, 72],
    owner: '赵销售',
    previousScore: 70,
  },
  {
    id: '3',
    name: '客服支持群',
    description: '客户服务与技术支持',
    memberCount: 28,
    createdAt: '2024-03-10',
    latestScore: 45,
    scoreBreakdown: {
      speakerPenetration: 38,
      avgMessagesPerSpeaker: 100,
      responseSpeedScore: 55,
      timeDistributionScore: 45,
      topicRelevanceScore: 42,
      atmosphereScore: 28,
    },
    todayMessages: 234,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'warning',
    riskStatus: {
      isNewGroup: false,
      isMicroGroup: false,
      hasConflictRisk: true,
      riskMessage: '检测到群内存在冲突风险，评分已降权处理',
    },
    recentScores: [45, 48, 42, 46, 44, 47, 43],
    owner: '周客服',
    previousScore: 48,
  },
  {
    id: '4',
    name: '市场推广群',
    description: '市场营销活动策划',
    memberCount: 18,
    createdAt: '2024-04-05',
    latestScore: 91,
    scoreBreakdown: {
      speakerPenetration: 88,
      avgMessagesPerSpeaker: 72,
      responseSpeedScore: 90,
      timeDistributionScore: 85,
      topicRelevanceScore: 95,
      atmosphereScore: 94,
    },
    todayMessages: 67,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
    recentScores: [91, 90, 92, 89, 91, 93, 90],
    owner: '陈运营',
    previousScore: 90,
  },
  {
    id: '5',
    name: '财务行政群',
    description: '财务与行政事务协调',
    memberCount: 15,
    createdAt: '2024-05-18',
    latestScore: 28,
    scoreBreakdown: {
      speakerPenetration: 22,
      avgMessagesPerSpeaker: 60,
      responseSpeedScore: 15,
      timeDistributionScore: 25,
      topicRelevanceScore: 35,
      atmosphereScore: 40,
    },
    todayMessages: 12,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'critical',
    recentScores: [28, 30, 25, 29, 27, 31, 26],
    owner: '吴财务',
    previousScore: 30,
  },
  {
    id: '6',
    name: '高管决策群',
    description: '公司高层决策讨论',
    memberCount: 8,
    createdAt: '2024-01-01',
    latestScore: 68,
    scoreBreakdown: {
      speakerPenetration: 78,
      avgMessagesPerSpeaker: 65,
      responseSpeedScore: 60,
      timeDistributionScore: 68,
      topicRelevanceScore: 72,
      atmosphereScore: 70,
    },
    todayMessages: 23,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'healthy',
    isExcludedFromScoring: true, // 测试：不参与评分的群
    recentScores: [68, 67, 70, 66, 69, 68, 65],
    owner: 'CEO',
    previousScore: 67,
  },
  {
    id: '7',
    name: '新项目筹备群',
    description: '新项目组筹备讨论',
    memberCount: 2,
    createdAt: '2024-12-01',
    latestScore: 0,
    scoreBreakdown: {
      speakerPenetration: 0,
      avgMessagesPerSpeaker: 0,
      responseSpeedScore: 0,
      timeDistributionScore: 0,
      topicRelevanceScore: 0,
      atmosphereScore: 0,
    },
    todayMessages: 3,
    lastAnalysisTime: '2024-12-04 09:00',
    status: 'warning',
    riskStatus: {
      isNewGroup: true,
      isMicroGroup: true,
      hasConflictRisk: false,
      riskMessage: '群聊数据尚不充分，暂不生成评分',
    },
    recentScores: [0, 0, 0, 0, 0, 0, 0],
    owner: '李工程师',
    previousScore: 0,
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

    // 生成六维评分数据
    const atmosphereScore = Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 20)));
    const hasConflictRisk = atmosphereScore < defaultThresholds.atmosphereMeltdownThreshold;
    const totalMessages = Math.floor(Math.random() * 200) + 50;
    const isNewGroup = totalMessages < defaultThresholds.coldStartMessageThreshold;
    const isMicroGroup = group.memberCount < defaultThresholds.microGroupMemberThreshold;

    return {
      id: `${groupId}-${dateStr}`,
      groupId,
      date: dateStr,
      overallScore: score,
      scoreBreakdown: {
        // 统计类指标
        speakerPenetration: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 15))),
        avgMessagesPerSpeaker: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 20))),
        responseSpeedScore: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 25))),
        timeDistributionScore: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 15))),
        // 语义类指标
        topicRelevanceScore: Math.max(0, Math.min(100, score + Math.round((Math.random() - 0.5) * 20))),
        atmosphereScore,
      },
      messageCount: totalMessages,
      activeMembers: Math.floor(Math.random() * group.memberCount * 0.8) + Math.floor(group.memberCount * 0.2),
      baseMetrics: {
        totalMessages,
        totalMembers: group.memberCount,
        activeSpeakers: Math.floor(Math.random() * group.memberCount * 0.8) + Math.floor(group.memberCount * 0.2),
        activeHours: Math.floor(Math.random() * 8) + 10,
        totalHours: 12,
        top20Percentage: Math.max(30, Math.min(85, 60 + (Math.random() - 0.5) * 40)),
        medianResponseInterval: Math.floor(Math.random() * 250) + 30, // 30-280秒
      },
      riskStatus: {
        isNewGroup,
        isMicroGroup,
        hasConflictRisk,
        riskMessage: hasConflictRisk
          ? '检测到群内存在冲突风险，评分已降权处理'
          : isNewGroup
            ? '群聊数据尚不充分，暂不生成评分'
            : isMicroGroup
              ? '微型群不参与排名'
              : undefined,
      },
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

// 会话存档统计数据接口
export interface ArchivingStat {
  name: string;
  value: number;
  color: string;
}

// 成员存档状态接口
export interface MemberArchivingStatus {
  id: string;
  name: string;
  department: string;
  archivingType: 'office' | 'service' | 'enterprise' | 'none'; // 办公版 | 服务版 | 企业版 | 未开启
  customerCount: number;
  agreedCount: number;
}

// Mock Archiving Stats Data
export const mockCustomerConsentStats: ArchivingStat[] = [
  { name: '已同意会话存档', value: 39, color: '#0084ff' }, // Azure Blue
  { name: '未同意会话存档', value: 0, color: '#e0e0e0' },
];

export const mockMemberArchivingStats: ArchivingStat[] = [
  { name: '已开启会话存档', value: 2, color: '#e1f5fe' }, // Light Blue
  { name: '未开启会话存档', value: 836, color: '#fafafa' }, // Light Grey
];

// Mock Member Archiving List
export const mockMemberArchivingList: MemberArchivingStatus[] = [
  { id: '1', name: '张经理', department: '产品部', archivingType: 'enterprise', customerCount: 15, agreedCount: 15 },
  { id: '2', name: '李工程师', department: '研发部', archivingType: 'office', customerCount: 0, agreedCount: 0 },
  { id: '3', name: '王产品', department: '产品部', archivingType: 'service', customerCount: 8, agreedCount: 8 },
  { id: '4', name: '赵销售', department: '销售部', archivingType: 'enterprise', customerCount: 120, agreedCount: 118 },
  { id: '5', name: '陈运营', department: '运营部', archivingType: 'service', customerCount: 56, agreedCount: 56 },
  { id: '6', name: '周客服', department: '客服部', archivingType: 'enterprise', customerCount: 200, agreedCount: 198 },
  { id: '7', name: '吴财务', department: '财务部', archivingType: 'office', customerCount: 5, agreedCount: 5 },
];

// 客户同意情况明细接口
export interface CustomerConsent {
  id: string;
  name: string;
  employeeId: string;
  employeeName: string;
  status: 'agreed' | 'disagreed';
  changeTime?: string;
}

// Mock Customer Consent List
export const mockCustomerConsentList: CustomerConsent[] = [
  { id: '1', name: '客户A', employeeId: '1', employeeName: '张经理', status: 'agreed', changeTime: '2022-08-10 10:30' },
  { id: '2', name: '客户B', employeeId: '1', employeeName: '张经理', status: 'agreed', changeTime: '2022-08-11 14:20' },
  { id: '3', name: '客户C', employeeId: '3', employeeName: '王产品', status: 'agreed', changeTime: '2022-08-12 09:15' },
  { id: '4', name: '客户D', employeeId: '3', employeeName: '王产品', status: 'disagreed' },
  { id: '5', name: '客户E', employeeId: '4', employeeName: '赵销售', status: 'agreed', changeTime: '2022-08-13 16:45' },
  { id: '6', name: '客户F', employeeId: '4', employeeName: '赵销售', status: 'agreed', changeTime: '2022-08-14 11:00' },
  { id: '7', name: '客户G', employeeId: '5', employeeName: '陈运营', status: 'disagreed' },
  { id: '8', name: '客户H', employeeId: '6', employeeName: '周客服', status: 'agreed', changeTime: '2022-08-15 13:30' },
];
