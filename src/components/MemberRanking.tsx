import { useState, useMemo } from 'react';
import { MemberStats } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Trophy, Users, ExternalLink, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface MemberRankingProps {
  members: MemberStats[];
  /** 群组所有成员列表（包含消息数为0的成员） */
  allMembers?: MemberStats[];
}

// 成员类型配置
const memberTypeConfig = {
  employee: { label: '企业成员', color: 'bg-blue-100 text-blue-600' },
  enterprise_friend: { label: '企业好友', color: 'bg-emerald-100 text-emerald-600' },
  external_friend: { label: '非企业好友', color: 'bg-orange-100 text-orange-600' },
};

type FilterType = 'all' | 'employee';

export function MemberRanking({ members, allMembers }: MemberRankingProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 根据筛选条件过滤成员
  const filteredMembers = useMemo(() => {
    if (filter === 'employee') {
      return members.filter(m => m.memberType === 'employee');
    }
    return members;
  }, [members, filter]);

  // 详情弹窗中的所有成员（包括消息数为0的）
  const detailMembers = useMemo(() => {
    const baseList = allMembers || members;
    let list = filter === 'employee' 
      ? baseList.filter(m => m.memberType === 'employee')
      : baseList;
    // 按消息数降序排列
    return [...list].sort((a, b) => b.messageCount - a.messageCount);
  }, [allMembers, members, filter]);

  const maxCount = Math.max(...filteredMembers.map(m => m.messageCount), 1);
  const detailMaxCount = Math.max(...detailMembers.map(m => m.messageCount), 1);

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
          
          {/* 详情入口 */}
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-primary">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                详情
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  成员消息数排名
                  <span className="text-sm font-normal text-muted-foreground">
                    ({filter === 'employee' ? '仅企业成员' : '全部成员'})
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              {/* 弹窗内筛选切换 */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 w-fit mb-4">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    filter === 'all'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  全部成员
                </button>
                <button
                  onClick={() => setFilter('employee')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                    filter === 'employee'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Users className="h-3 w-3" />
                  仅企业成员
                </button>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2.5">
                  {detailMembers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      暂无成员数据
                    </div>
                  ) : (
                    detailMembers.map((member, index) => (
                      <div key={member.name} className="flex items-center gap-3 group py-1">
                        <span className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 flex-shrink-0",
                          index === 0 && member.messageCount > 0 && "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm",
                          index === 1 && member.messageCount > 0 && "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm",
                          index === 2 && member.messageCount > 0 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-sm",
                          (index > 2 || member.messageCount === 0) && "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                {member.name}
                              </span>
                              {member.memberType && (
                                <span className={cn(
                                  "px-1.5 py-0.5 text-[10px] font-medium rounded flex-shrink-0",
                                  memberTypeConfig[member.memberType].color
                                )}>
                                  {memberTypeConfig[member.memberType].label}
                                </span>
                              )}
                            </div>
                            <span className={cn(
                              "text-sm font-semibold flex-shrink-0 ml-2",
                              member.messageCount === 0 ? "text-muted-foreground" : "text-foreground"
                            )}>
                              {member.messageCount}
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                member.messageCount === 0 
                                  ? "bg-muted" 
                                  : "bg-gradient-to-r from-primary to-emerald-400"
                              )}
                              style={{ width: `${Math.max((member.messageCount / detailMaxCount) * 100, 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              <div className="text-xs text-muted-foreground pt-2 border-t">
                共 {detailMembers.length} 人 · 
                {filter === 'employee' && ' 仅显示企业成员 · '}
                消息数为0的成员也已列出
              </div>
            </DialogContent>
          </Dialog>
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
      
      {/* 底部提示 */}
      {filteredMembers.length > 8 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsDetailOpen(true)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            点击"详情"查看全部 {filteredMembers.length} 人
          </button>
        </div>
      )}
    </div>
  );
}
