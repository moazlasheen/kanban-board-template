import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Circle, Timer, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Card, Column } from '@/lib/types';
import { KanbanCard } from './KanbanCard';

const COLUMN_ICONS: Record<string, React.ReactNode> = {
  circle: <Circle className="h-3.5 w-3.5" />,
  timer: <Timer className="h-3.5 w-3.5" />,
  'check-circle-2': <CheckCircle2 className="h-3.5 w-3.5" />,
};

const COLUMN_COLORS: Record<string, string> = {
  todo: 'text-muted-foreground',
  'in-progress': 'text-[#f59e0b]',
  done: 'text-[#27a644]',
};

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  totalCount: number;
  onAddCard: () => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (id: string) => void;
  isOver?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  totalCount,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const cardIds = cards.map((c) => c.id);

  return (
    <div className="flex flex-col min-w-[320px] max-w-[380px] w-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={COLUMN_COLORS[column.id]}>
            {COLUMN_ICONS[column.icon]}
          </span>
          <h2 className="text-[13px] font-[510] tracking-[-0.01em] text-foreground">
            {column.title}
          </h2>
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent/80 px-1.5 text-[10px] font-[510] tabular-nums text-muted-foreground">
            {totalCount}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddCard}
          className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl border border-dashed transition-colors duration-200 ${
          isOver
            ? 'border-[#5e6ad2]/40 bg-[#5e6ad2]/[0.03]'
            : 'border-transparent'
        }`}
      >
        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="space-y-2 p-1">
            <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
              {cards.map((card) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                />
              ))}
            </SortableContext>

            {cards.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-8 w-8 rounded-full bg-accent/60 flex items-center justify-center mb-3">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-[12px] text-muted-foreground/60 font-[410]">
                  No tasks yet
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
