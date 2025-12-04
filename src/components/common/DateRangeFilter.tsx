import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export type DateRange = {
  from: Date;
  to: Date;
};

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const presets = [
  { label: '今日', days: 0 },
  { label: '近7天', days: 7 },
  { label: '近30天', days: 30 },
];

export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({ from, to });
  };

  const getActivePreset = () => {
    const diffDays = Math.round((value.to.getTime() - value.from.getTime()) / (1000 * 60 * 60 * 24));
    return presets.find(p => p.days === diffDays)?.label;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant={getActivePreset() === preset.label ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePreset(preset.days)}
        >
          {preset.label}
        </Button>
      ))}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(value.from, 'MM/dd', { locale: zhCN })} - {format(value.to, 'MM/dd', { locale: zhCN })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={{ from: value.from, to: value.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onChange({ from: range.from, to: range.to });
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
