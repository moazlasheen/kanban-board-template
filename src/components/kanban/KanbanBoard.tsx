import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { COLUMNS } from '@/lib/types';
import type { Card, ColumnId } from '@/lib/types';
import { useKanbanStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { Header } from './Header';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { CardDialog } from './CardDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function KanbanBoard() {
  const {
    cards,
    searchQuery,
    setSearchQuery,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    getFilteredCards,
    getColumnCount,
  } = useKanbanStore();

  const { theme, toggleTheme } = useTheme();

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>('todo');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const card = active.data.current?.card as Card | undefined;
    if (card) setActiveCard(card);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      if (!activeData) return;

      const activeCardData = activeData.card as Card | undefined;
      if (!activeCardData) return;

      let targetColumnId: ColumnId | null = null;

      if (overData?.type === 'column') {
        targetColumnId = overData.column.id as ColumnId;
      } else if (overData?.type === 'card') {
        targetColumnId = (overData.card as Card).columnId;
      }

      if (targetColumnId && activeCardData.columnId !== targetColumnId) {
        moveCard(activeCardData.id, targetColumnId);
        setActiveCard((prev) =>
          prev ? { ...prev, columnId: targetColumnId! } : null
        );
      }
    },
    [moveCard]
  );

  const handleDragEnd = useCallback((_event: DragEndEvent) => {
    setActiveCard(null);
  }, []);

  const handleAddCard = useCallback((columnId: ColumnId) => {
    setEditingCard(null);
    setDefaultColumn(columnId);
    setDialogOpen(true);
  }, []);

  const handleEditCard = useCallback((card: Card) => {
    setEditingCard(card);
    setDefaultColumn(card.columnId);
    setDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeletingCardId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingCardId) {
      deleteCard(deletingCardId);
      setDeletingCardId(null);
    }
    setDeleteDialogOpen(false);
  }, [deletingCardId, deleteCard]);

  const handleSave = useCallback(
    (data: {
      title: string;
      description: string;
      priority: Card['priority'];
      columnId: ColumnId;
      labels: string[];
    }) => {
      if (editingCard) {
        updateCard(editingCard.id, data);
      } else {
        addCard(data);
      }
    },
    [editingCard, updateCard, addCard]
  );

  const deletingCard = deletingCardId
    ? cards.find((c) => c.id === deletingCardId)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onThemeToggle={toggleTheme}
        totalCards={cards.length}
      />

      <main className="flex-1 overflow-x-auto">
        <div className="mx-auto max-w-[1440px] p-4 sm:p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-5">
              {COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={getFilteredCards(column.id)}
                  totalCount={getColumnCount(column.id)}
                  onAddCard={() => handleAddCard(column.id)}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteRequest}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeCard ? (
                <div className="w-[340px]">
                  <KanbanCard
                    card={activeCard}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isDragOverlay
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      <CardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        card={editingCard}
        defaultColumnId={defaultColumn}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        taskTitle={deletingCard?.title}
      />
    </div>
  );
}
