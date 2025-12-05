import { AlertCircle, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsufficientDataOverlayProps {
  reason: 'cold_start' | 'micro_group' | 'both';
  messageThreshold?: number;
  memberThreshold?: number;
  className?: string;
}

export function InsufficientDataOverlay({
  reason,
  messageThreshold = 5,
  memberThreshold = 3,
  className,
}: InsufficientDataOverlayProps) {
  const reasonConfig = {
    cold_start: {
      icon: MessageCircle,
      title: '数据不足，暂不评分',
      description: `群聊消息数少于 ${messageThreshold} 条，无法生成有效评分`,
    },
    micro_group: {
      icon: Users,
      title: '微型群，暂不评分',
      description: `群成员少于 ${memberThreshold} 人，暂不参与评分`,
    },
    both: {
      icon: AlertCircle,
      title: '数据不足，暂不评分',
      description: `群聊消息数少于 ${messageThreshold} 条且成员少于 ${memberThreshold} 人`,
    },
  };

  const config = reasonConfig[reason];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center',
        'bg-background/80 backdrop-blur-sm rounded-xl',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center px-6">
        <div className="p-3 rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-semibold text-foreground">{config.title}</h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          {config.description}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          待数据积累后将自动生成评分
        </p>
      </div>
    </div>
  );
}
