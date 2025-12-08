import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { path: '/', label: '总览', icon: LayoutDashboard },
  { path: '/groups', label: '群聊管理', icon: MessageSquare },
  { path: '/reports', label: '分析记录', icon: FileText },
  { path: '/archiving', label: '存档统计', icon: Shield },
  { path: '/settings/rules', label: '规则配置', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50',
      collapsed ? 'w-16' : 'w-56'
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-sm">群聊分析</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
