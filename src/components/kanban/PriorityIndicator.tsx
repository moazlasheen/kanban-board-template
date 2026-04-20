import type { Priority } from '@/lib/types';
import { PRIORITIES } from '@/lib/types';

interface PriorityIndicatorProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export function PriorityIndicator({ priority, size = 'sm' }: PriorityIndicatorProps) {
  const config = PRIORITIES.find((p) => p.value === priority);
  if (!config) return null;

  const barCount = priority === 'low' ? 1 : priority === 'medium' ? 2 : priority === 'high' ? 3 : 4;
  const dim = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <div
      className={`${dim} flex items-end gap-[1.5px]`}
      title={`${config.label} priority`}
      aria-label={`${config.label} priority`}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex-1 rounded-[0.5px] transition-colors"
          style={{
            height: `${(i / 4) * 100}%`,
            backgroundColor: i <= barCount ? config.color : 'hsl(var(--muted-foreground) / 0.15)',
          }}
        />
      ))}
    </div>
  );
}
