import { cn } from '@/lib/utils';
import { getScoreLevel } from '@/lib/mockData';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 60, stroke: 4, fontSize: 'text-lg' },
  md: { width: 100, stroke: 6, fontSize: 'text-2xl' },
  lg: { width: 140, stroke: 8, fontSize: 'text-4xl' },
};

export function ScoreRing({ score, size = 'md', showLabel = true, className }: ScoreRingProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const level = getScoreLevel(score);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={level.color}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', config.fontSize, level.color)}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium px-2 py-0.5 rounded', level.bgColor, level.color)}>
          {level.label}
        </span>
      )}
    </div>
  );
}
