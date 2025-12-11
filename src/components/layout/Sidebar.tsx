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
  { path: '/groups', label: '群聊分析', icon: MessageSquare },
  { path: '/reports', label: '分析记录', icon: FileText },
  { path: '/archiving', label: '存档统计', icon: Shield },
  { path: '/settings/rules', label: '规则配置', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 shadow-sm',
      collapsed ? 'w-16' : 'w-60'
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <span className="font-semibold text-sm">会话存档</span>
                <p className="text-[10px] text-muted-foreground">WeChat Analytics</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm mx-auto">
              <MessageSquare className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-sm hover:bg-muted"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1.5">
          {!collapsed && (
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">导航菜单</p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "drop-shadow-sm")} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">版本 1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
