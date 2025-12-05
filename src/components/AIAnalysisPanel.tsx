import { AIInsight } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AIAnalysisPanelProps {
  insight: AIInsight;
}

export function AIAnalysisPanel({ insight }: AIAnalysisPanelProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-primary';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-primary/10';
      case 'negative': return 'bg-destructive/10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-up glow-primary" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">AI 智能分析</h3>
        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary ml-auto">
          GPT-4 分析
        </span>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">对话摘要</h4>
        <p className="text-sm leading-relaxed">{insight.summary}</p>
      </div>

      {/* Sentiment Analysis */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">情感分析</h4>
        <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-muted">
          <div
            className="bg-primary transition-all duration-500"
            style={{ width: `${insight.sentiment.positive}%` }}
          />
          <div
            className="bg-muted-foreground/50 transition-all duration-500"
            style={{ width: `${insight.sentiment.neutral}%` }}
          />
          <div
            className="bg-destructive transition-all duration-500"
            style={{ width: `${insight.sentiment.negative}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-primary">积极 {insight.sentiment.positive}%</span>
          <span className="text-muted-foreground">中性 {insight.sentiment.neutral}%</span>
          <span className="text-destructive">消极 {insight.sentiment.negative}%</span>
        </div>
      </div>

      {/* Hot Topics */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">热门话题</h4>
        <div className="flex flex-wrap gap-2">
          {insight.topics.map((topic) => (
            <span
              key={topic.name}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm",
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
        <h4 className="text-sm font-medium text-muted-foreground mb-3">重点提示</h4>
        <div className="space-y-2">
          {insight.keyHighlights.map((highlight, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 p-3 rounded-lg text-sm",
                highlight.includes('需关注') ? 'bg-destructive/10 text-destructive' : 'bg-muted'
              )}
            >
              {highlight.includes('需关注') ? (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              )}
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
