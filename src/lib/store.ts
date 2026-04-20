import { useState, useEffect, useCallback } from 'react';
import type { Card, ColumnId } from './types';

const STORAGE_KEY = 'kanban-board-data';

const DEFAULT_CARDS: Card[] = [
  {
    id: 'card-1',
    title: 'Set up project repository',
    description: 'Initialize the monorepo with proper tooling, linting, and CI/CD pipeline configuration.',
    priority: 'high',
    columnId: 'done',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    labels: ['DevOps'],
  },
  {
    id: 'card-2',
    title: 'Design system foundations',
    description: 'Create color tokens, typography scale, spacing system, and core component primitives.',
    priority: 'high',
    columnId: 'done',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    labels: ['Design', 'Frontend'],
  },
  {
    id: 'card-3',
    title: 'Implement authentication flow',
    description: 'Build sign-up, sign-in, password reset, and email verification with OAuth providers.',
    priority: 'urgent',
    columnId: 'in-progress',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    labels: ['Backend', 'Feature'],
  },
  {
    id: 'card-4',
    title: 'Dashboard analytics widgets',
    description: 'Create chart components for revenue, user growth, and engagement metrics.',
    priority: 'medium',
    columnId: 'in-progress',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    labels: ['Frontend', 'Feature'],
  },
  {
    id: 'card-5',
    title: 'API rate limiting middleware',
    description: 'Implement token bucket algorithm for API rate limiting with Redis backing store.',
    priority: 'high',
    columnId: 'todo',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    labels: ['Backend', 'Improvement'],
  },
  {
    id: 'card-6',
    title: 'Mobile responsive navigation',
    description: 'Adapt the sidebar navigation for mobile viewports with gesture support.',
    priority: 'medium',
    columnId: 'todo',
    createdAt: new Date().toISOString(),
    labels: ['Frontend', 'Design'],
  },
  {
    id: 'card-7',
    title: 'Fix date picker timezone bug',
    description: 'Date picker shows incorrect dates for users in negative UTC offset timezones.',
    priority: 'urgent',
    columnId: 'todo',
    createdAt: new Date().toISOString(),
    labels: ['Bug', 'Frontend'],
  },
  {
    id: 'card-8',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with request/response examples using OpenAPI spec.',
    priority: 'low',
    columnId: 'todo',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    labels: ['Documentation'],
  },
];

function loadCards(): Card[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return DEFAULT_CARDS;
}

function saveCards(cards: Card[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export function useKanbanStore() {
  const [cards, setCards] = useState<Card[]>(loadCards);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveCards(cards);
  }, [cards]);

  const addCard = useCallback((card: Omit<Card, 'id' | 'createdAt'>) => {
    const newCard: Card = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [newCard, ...prev]);
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<Omit<Card, 'id'>>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const moveCard = useCallback((cardId: string, toColumn: ColumnId) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, columnId: toColumn } : c))
    );
  }, []);

  const getFilteredCards = useCallback(
    (columnId: ColumnId) => {
      const q = searchQuery.toLowerCase().trim();
      return cards
        .filter((c) => c.columnId === columnId)
        .filter((c) => {
          if (!q) return true;
          return (
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.labels.some((l) => l.toLowerCase().includes(q))
          );
        });
    },
    [cards, searchQuery]
  );

  const getColumnCount = useCallback(
    (columnId: ColumnId) => cards.filter((c) => c.columnId === columnId).length,
    [cards]
  );

  return {
    cards,
    searchQuery,
    setSearchQuery,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    getFilteredCards,
    getColumnCount,
  };
}
