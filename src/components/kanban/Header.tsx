import { Kanban } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  theme: string;
  onThemeToggle: () => void;
  totalCards: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  theme,
  onThemeToggle,
  totalCards,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5e6ad2]">
            <Kanban className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[15px] font-[510] tracking-[-0.01em] text-foreground">
              Board
            </h1>
            <span className="text-[12px] font-[410] tabular-nums text-muted-foreground">
              {totalCards} tasks
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
          <div className="h-4 w-px bg-border/60 mx-1" />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
