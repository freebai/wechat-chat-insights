import { AIInsight } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Sparkles, AlertCircle, CheckCircle2, Brain, Calendar, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIAnalysisPanelProps {
  insight: AIInsight;
  date?: string;
  /** 可用的分析日期列表（仅从群聊管理进入时使用） */
  availableDates?: string[];
  /** 日期变更回调 */
  onDateChange?: (date: string) => void;
  /** 是否显示日期选择器（从群聊管理进入时为true） */
  showDatePicker?: boolean;
}

export function AIAnalysisPanel({ insight, date, availableDates = [], onDateChange, showDatePicker = false }: AIAnalysisPanelProps) {
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

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-up overflow-hidden" style={{ animationDelay: '400ms' }}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 ring-4 ring-primary/5">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI 智能分析</h3>
              <p className="text-xs text-muted-foreground mt-0.5">基于对话内容的深度分析</p>
            </div>
          </div>
          {showDatePicker && availableDates.length > 0 ? (
            <Select value={date} onValueChange={onDateChange}>
              <SelectTrigger className="w-36 h-8 text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="选择日期" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((d) => (
                  <SelectItem key={d} value={d} className="text-xs">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              {date ? `${date}` : 'GPT-4'}
            </span>
          )}
        </div>
      </div>

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
    </div>
  );
}
