import { MemberStats } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface MemberRankingProps {
  members: MemberStats[];
}

// 成员类型配置
const memberTypeConfig = {
  employee: { label: '企业成员', color: 'bg-blue-100 text-blue-600' },
  enterprise_friend: { label: '企业好友', color: 'bg-emerald-100 text-emerald-600' },
  external_friend: { label: '非企业好友', color: 'bg-orange-100 text-orange-600' },
};

export function MemberRanking({ members }: MemberRankingProps) {
  const maxCount = Math.max(...members.map(m => m.messageCount));

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-amber-50">
          <Trophy className="h-4 w-4 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold">成员活跃度排行</h3>
      </div>
      <div className="space-y-3">
        {members.slice(0, 8).map((member, index) => (
          <div key={member.name} className="flex items-center gap-3 group">
            <span className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110",
              index === 0 && "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm",
              index === 1 && "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm",
              index === 2 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-sm",
              index > 2 && "bg-muted text-muted-foreground"
            )}>
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{member.name}</span>
                  {member.memberType && (
                    <span className={cn(
                      "px-1.5 py-0.5 text-[10px] font-medium rounded flex-shrink-0",
                      memberTypeConfig[member.memberType].color
                    )}>
                      {memberTypeConfig[member.memberType].label}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground flex-shrink-0 ml-2">{member.messageCount}</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
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
