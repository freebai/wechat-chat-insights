import { MessageSquare, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onUpload?: () => void;
  onRefresh?: () => void;
}

export function Header({ onUpload, onRefresh }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            企业微信<span className="text-gradient">会话存档</span>
          </h1>
          <p className="text-sm text-muted-foreground">会话存档数据分析与AI洞察</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          刷新数据
        </Button>
        <Button
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={onUpload}
        >
          <Upload className="h-4 w-4" />
          上传存档
        </Button>
      </div>
    </header>
  );
}
