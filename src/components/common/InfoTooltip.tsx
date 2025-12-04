import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  title?: string;
  className?: string;
}

export function InfoTooltip({ content, title, className }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className={cn('text-muted-foreground hover:text-foreground transition-colors', className)}>
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        {title && <p className="font-medium mb-1">{title}</p>}
        <p className="text-sm text-muted-foreground">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
