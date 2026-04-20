export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: ColumnId;
  createdAt: string;
  labels: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  icon: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'Todo', icon: 'circle' },
  { id: 'in-progress', title: 'In Progress', icon: 'timer' },
  { id: 'done', title: 'Done', icon: 'check-circle-2' },
];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#8a8f98' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

export const LABEL_OPTIONS = [
  'Bug',
  'Feature',
  'Improvement',
  'Design',
  'Backend',
  'Frontend',
  'DevOps',
  'Documentation',
];
