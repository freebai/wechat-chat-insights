import { useState } from 'react';
import { AIInsight } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Sparkles, AlertCircle, CheckCircle2, Brain, Calendar, FileQuestion } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AnalysisDimension = 'day' | 'week' | 'month';

interface AIAnalysisPanelProps {
  insight?: AIInsight;
  date?: string;
  /** 可用的分析日期列表（仅从群聊管理进入时使用） */
  availableDates?: string[];
  /** 日期变更回调 */
  onDateChange?: (date: string) => void;
  /** 是否显示日期选择器（从群聊管理进入时为true） */
  showDatePicker?: boolean;
  /** 是否展示空状态 */
  isEmpty?: boolean;
  /** 空状态原因: 'excluded'=不参与AI分析, 'insufficient'=不满足门槛, 'no_data'=无昨日数据 */
  emptyReason?: 'excluded' | 'insufficient' | 'no_data';
}

// 获取维度的更新说明
const getDimensionUpdateInfo = (dimension: AnalysisDimension): string => {
  switch (dimension) {
    case 'week':
      return '每周一更新上周数据';
    case 'month':
      return '每月初一更新上月数据';
    default:
      return '每日更新昨日数据';
  }
};

// 根据维度格式化日期显示
const formatDateByDimension = (dateStr: string, dimension: AnalysisDimension): string => {
  const date = new Date(dateStr);
  switch (dimension) {
    case 'week': {
      // 获取该日期所在周的起始和结束日期
      const dayOfWeek = date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const formatShort = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
      return `${formatShort(monday)} - ${formatShort(sunday)}`;
    }
    case 'month': {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    }
    default:
      return dateStr;
  }
};

// 根据维度生成可选日期列表（去重）
const getDateOptionsByDimension = (dates: string[], dimension: AnalysisDimension): { value: string; label: string }[] => {
  if (dimension === 'day') {
    return dates.map(d => ({ value: d, label: d }));
  }

  const seen = new Set<string>();
  const options: { value: string; label: string }[] = [];

  for (const d of dates) {
    const label = formatDateByDimension(d, dimension);
    if (!seen.has(label)) {
      seen.add(label);
      options.push({ value: d, label });
    }
  }

  return options;
};

export function AIAnalysisPanel({
  insight,
  date,
  availableDates = [],
  onDateChange,
  showDatePicker = false,
  isEmpty = false,
  emptyReason = 'no_data'
}: AIAnalysisPanelProps) {
  const [dimension, setDimension] = useState<AnalysisDimension>('day');

  // 根据当前维度生成可选日期选项
  const dateOptions = getDateOptionsByDimension(availableDates, dimension);

  // 获取当前选中日期的显示标签
  const currentDateLabel = date ? formatDateByDimension(date, dimension) : '';

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600';
      case 'negative': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-50 border-emerald-200';
      case 'negative': return 'bg-red-50 border-red-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  // 空状态提示配置
  const emptyStateConfig = {
    excluded: {
      title: '此群聊不参与AI分析',
      description: '该群聊已被配置为不参与 AI 智能分析',
    },
    insufficient: {
      title: '暂不满足分析条件',
      description: '群聊数据量不足（消息数或成员数未达到门槛）',
    },
    no_data: {
      title: '暂无分析记录',
      description: '该日期暂无 AI 分析记录，请选择其他日期查看。',
    },
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-up overflow-hidden" style={{ animationDelay: '400ms' }}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 ring-4 ring-primary/5">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI 智能分析</h3>
              <p className="text-xs text-muted-foreground mt-0.5">基于对话内容的深度分析</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 分析维度切换 */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              {[
                { key: 'day' as const, label: '日' },
                { key: 'week' as const, label: '周' },
                { key: 'month' as const, label: '月' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setDimension(item.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    dimension === item.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {showDatePicker ? (
              <Select value={date || ''} onValueChange={onDateChange}>
                <SelectTrigger className={cn(
                  "h-8 text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
                  dimension === 'day' ? "w-36" : dimension === 'week' ? "w-40" : "w-32"
                )}>
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span className="truncate">{currentDateLabel || (dimension === 'day' ? '选择日期' : dimension === 'week' ? '选择周' : '选择月份')}</span>
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.length > 0 ? (
                    dateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">暂无可选日期</div>
                  )}
                </SelectContent>
              </Select>
            ) : (
              <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                {date ? currentDateLabel : 'GPT-4'}
              </span>
            )}
          </div>
        </div>

        {/* 更新说明 */}
        <p className="text-[10px] text-muted-foreground mt-2 pl-14">
          {getDimensionUpdateInfo(dimension)}
        </p>
      </div>

      {/* 空状态展示 */}
      {isEmpty || !insight ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <FileQuestion className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {emptyStateConfig[emptyReason].title}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {emptyStateConfig[emptyReason].description}
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              对话摘要
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-xl">{insight.summary}</p>
          </div>

          {/* Sentiment Analysis */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">情感分析</h4>
            <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-muted/50">
              <div
                className="bg-emerald-500 rounded-l-full transition-all duration-500"
                style={{ width: `${insight.sentiment.positive}%` }}
              />
              <div
                className="bg-slate-400 transition-all duration-500"
                style={{ width: `${insight.sentiment.neutral}%` }}
              />
              <div
                className="bg-red-500 rounded-r-full transition-all duration-500"
                style={{ width: `${insight.sentiment.negative}%` }}
              />
            </div>
            <div className="flex justify-between mt-2.5 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-600">积极 {insight.sentiment.positive}%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-500">中性 {insight.sentiment.neutral}%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-600">消极 {insight.sentiment.negative}%</span>
              </span>
            </div>
          </div>

          {/* Hot Topics */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">热门话题</h4>
            <div className="flex flex-wrap gap-2">
              {insight.topics.map((topic) => (
                <span
                  key={topic.name}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all hover:scale-105",
                    getSentimentBg(topic.sentiment),
                    getSentimentColor(topic.sentiment)
                  )}
                >
                  {topic.name}
                </span>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">重点提示</h4>
            <div className="space-y-2">
              {insight.keyHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl text-sm border",
                    highlight.includes('需关注')
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  )}
                >
                  {highlight.includes('需关注') ? (
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                  )}
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

