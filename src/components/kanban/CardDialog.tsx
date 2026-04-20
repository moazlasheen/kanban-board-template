import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Card, ColumnId, Priority } from '@/lib/types';
import { PRIORITIES, LABEL_OPTIONS, COLUMNS } from '@/lib/types';
import { PriorityIndicator } from './PriorityIndicator';

interface CardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: Card | null;
  defaultColumnId?: ColumnId;
  onSave: (data: {
    title: string;
    description: string;
    priority: Priority;
    columnId: ColumnId;
    labels: string[];
  }) => void;
}

export function CardDialog({
  open,
  onOpenChange,
  card,
  defaultColumnId = 'todo',
  onSave,
}: CardDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumnId);
  const [labels, setLabels] = useState<string[]>([]);

  const isEditing = !!card;

  useEffect(() => {
    if (open) {
      if (card) {
        setTitle(card.title);
        setDescription(card.description);
        setPriority(card.priority);
        setColumnId(card.columnId);
        setLabels(card.labels);
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setColumnId(defaultColumnId);
        setLabels([]);
      }
    }
  }, [open, card, defaultColumnId]);

  const toggleLabel = (label: string) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), priority, columnId, labels });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] border-border/60 bg-card gap-0 p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-[15px] font-[510] tracking-[-0.01em]">
              {isEditing ? 'Edit task' : 'New task'}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              {isEditing
                ? 'Update the task details below.'
                : 'Fill in the details to create a new task.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 pb-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[13px] font-[510]">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title…"
                className="h-9 text-[13px] bg-transparent border-border/60 focus-visible:ring-ring/30"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[13px] font-[510]">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description…"
                className="min-h-[80px] text-[13px] bg-transparent border-border/60 resize-none focus-visible:ring-ring/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-[510]">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="h-9 text-[13px] bg-transparent border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-[13px]">
                        <div className="flex items-center gap-2">
                          <PriorityIndicator priority={p.value} />
                          <span>{p.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-[510]">Status</Label>
                <Select value={columnId} onValueChange={(v) => setColumnId(v as ColumnId)}>
                  <SelectTrigger className="h-9 text-[13px] bg-transparent border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMNS.map((col) => (
                      <SelectItem key={col.id} value={col.id} className="text-[13px]">
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-[510]">Labels</Label>
              <div className="flex flex-wrap gap-1.5">
                {LABEL_OPTIONS.map((label) => {
                  const isActive = labels.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleLabel(label)}
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-[510] transition-colors border ${
                        isActive
                          ? 'border-[#5e6ad2]/40 bg-[#5e6ad2]/10 text-[#828fff]'
                          : 'border-border/60 bg-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border/40 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-8 text-[13px] font-[510]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="h-8 text-[13px] font-[510] bg-[#5e6ad2] text-white hover:bg-[#6872d6] disabled:opacity-40"
            >
              {isEditing ? 'Save changes' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
