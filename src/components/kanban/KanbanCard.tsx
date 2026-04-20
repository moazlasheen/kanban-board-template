import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { Card } from '@/lib/types';
import { PriorityIndicator } from './PriorityIndicator';
import { formatDistanceToNow } from 'date-fns';

interface KanbanCardProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

export function KanbanCard({ card, onEdit, onDelete, isDragOverlay }: KanbanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const timeAgo = formatDistanceToNow(new Date(card.createdAt), { addSuffix: true });

  if (isDragging && !isDragOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[1px] rounded-md bg-[#5e6ad2]/30 my-1"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border bg-card transition-all duration-150 kanban-card-enter ${
        isDragOverlay
          ? 'drag-overlay border-[#5e6ad2]/40 shadow-xl shadow-black/20 ring-1 ring-[#5e6ad2]/20'
          : 'border-border/40 hover:border-border/70'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-l-lg transition-opacity ${
          isHovered || isDragOverlay ? 'opacity-60' : 'opacity-0'
        }`}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="p-3 pl-6">
        {/* Top row: priority + actions */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <PriorityIndicator priority={card.priority} />
            <h3 className="text-[13px] font-[510] leading-snug tracking-[-0.01em] text-foreground truncate">
              {card.title}
            </h3>
          </div>

          {/* Action buttons */}
          <div
            className={`flex items-center gap-0.5 shrink-0 transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Edit task"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Description */}
        {card.description && (
          <p className="text-[12px] leading-relaxed text-muted-foreground line-clamp-2 mb-2.5">
            {card.description}
          </p>
        )}

        {/* Bottom row: labels + timestamp */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            {card.labels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded px-1.5 py-[1px] text-[10px] font-[510] bg-accent/60 text-muted-foreground border border-border/30"
              >
                {label}
              </span>
            ))}
            {card.labels.length > 3 && (
              <span className="text-[10px] text-muted-foreground/60 font-[410]">
                +{card.labels.length - 3}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground/50 font-[410] tabular-nums shrink-0">
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}
