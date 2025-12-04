import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockChatGroups, getScoreLevel } from '@/lib/mockData';
import { ScoreRing } from '@/components/common/ScoreRing';
import { cn } from '@/lib/utils';

export default function Groups() {
  const [search, setSearch] = useState('');

  const filteredGroups = mockChatGroups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const warningCount = mockChatGroups.filter(g => g.status === 'warning' || g.status === 'critical').length;

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">群聊管理</h1>
          <p className="text-muted-foreground mt-1">管理和监控所有群聊的健康状态</p>
        </div>
        {warningCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{warningCount} 个群聊需要关注</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索群聊..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => {
          const level = getScoreLevel(group.latestScore);
          
          return (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className={cn(
                'glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300',
                group.status === 'critical' && 'border-destructive/50',
                group.status === 'warning' && 'border-yellow-400/50'
              )}
            >
              <div className="flex items-start gap-4">
                <ScoreRing score={group.latestScore} size="sm" showLabel={false} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{group.name}</h3>
                    <span className={cn('text-xs px-2 py-0.5 rounded', level.bgColor, level.color)}>
                      {level.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{group.memberCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{group.todayMessages}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{group.lastAnalysisTime.split(' ')[1]}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
