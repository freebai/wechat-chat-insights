import { MemberStats } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface MemberRankingProps {
  members: MemberStats[];
}

export function MemberRanking({ members }: MemberRankingProps) {
  const maxCount = Math.max(...members.map(m => m.messageCount));

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-lg font-semibold mb-4">成员活跃度排行</h3>
      <div className="space-y-3">
        {members.slice(0, 8).map((member, index) => (
          <div key={member.name} className="flex items-center gap-3">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
              index < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{member.name}</span>
                <span className="text-sm text-muted-foreground">{member.messageCount}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-wechat-glow rounded-full transition-all duration-500"
                  style={{ width: `${(member.messageCount / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
