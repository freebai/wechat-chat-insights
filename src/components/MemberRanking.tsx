import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MemberStats } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Trophy, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemberRankingProps {
  members: MemberStats[];
  /** 群组所有成员列表（包含消息数为0的成员） */
  allMembers?: MemberStats[];
  /** 当前群组 ID，用于详情页导航 */
  groupId?: string;
}

// 成员类型配置
const memberTypeConfig = {
  employee: { label: '企业成员', color: 'bg-blue-100 text-blue-600' },
  enterprise_friend: { label: '企业好友', color: 'bg-emerald-100 text-emerald-600' },
  external_friend: { label: '非企业好友', color: 'bg-orange-100 text-orange-600' },
};

type FilterType = 'all' | 'employee';

export function MemberRanking({ members, allMembers, groupId }: MemberRankingProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // 根据筛选条件过滤成员
  const filteredMembers = useMemo(() => {
    if (filter === 'employee') {
      return members.filter(m => m.memberType === 'employee');
    }
    return members;
  }, [members, filter]);

  const maxCount = Math.max(...filteredMembers.map(m => m.messageCount), 1);

  // 构建详情页链接
  const detailUrl = `/members/ranking?groupId=${groupId || 'all'}&memberType=${filter}`;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50">
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold">成员消息数排名</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* 筛选切换 */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                filter === 'all'
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('employee')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                filter === 'employee'
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="h-3 w-3" />
              企业成员
            </button>
          </div>

          {/* 详情入口 - 导航到独立页面 */}
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary" asChild>
            <Link to={detailUrl}>
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              详情
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            暂无{filter === 'employee' ? '企业成员' : '成员'}消息数据
          </div>
        ) : (
          filteredMembers.slice(0, 8).map((member, index) => (
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
          ))
        )}
      </div>

    </div>
  );
}
