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
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  showAll?: boolean;
}

const defaultPresets = [
  { label: '昨日', days: 1 },
  { label: '近7天', days: 7 },
  { label: '近30天', days: 30 },
];

export function DateRangeFilter({ value, onChange, className, showAll = false }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = showAll
    ? [{ label: '全部', days: 0 }, ...defaultPresets]
    : defaultPresets;

  const handlePreset = (days: number) => {
    if (days === 0) {
      onChange(undefined);
      return;
    }
    const to = new Date();
    const from = new Date();
    if (days === 1) {
      // "昨日"特殊处理：from 和 to 都设为昨天
      from.setDate(from.getDate() - 1);
      to.setDate(to.getDate() - 1);
    } else {
      // 其他预设：from 往前推 days 天，to 为今天
      from.setDate(from.getDate() - days);
    }
    onChange({ from, to });
  };

  const getActivePreset = () => {
    if (!value) return '全部';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fromDate = new Date(value.from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(value.to);
    toDate.setHours(0, 0, 0, 0);

    // 检查是否是"昨日"：from 和 to 都是昨天
    if (fromDate.getTime() === yesterday.getTime() && toDate.getTime() === yesterday.getTime()) {
      return '昨日';
    }

    // 检查其他预设：to 是今天，计算 from 和 to 的差值
    if (toDate.getTime() === today.getTime()) {
      const diffDays = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      const preset = presets.find(p => p.days === diffDays && p.days !== 1 && p.days !== 0);
      if (preset) return preset.label;
    }

    return undefined;
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
            {value ? (
              <>
                {format(value.from, 'MM/dd', { locale: zhCN })} - {format(value.to, 'MM/dd', { locale: zhCN })}
              </>
            ) : (
              '选择日期范围'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={value ? { from: value.from, to: value.to } : undefined}
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
