import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative group">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks…"
        className="h-8 w-48 rounded-md border border-border/60 bg-transparent pl-8 pr-8 text-[13px] font-[410] text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:w-64 focus:border-ring/40 focus:ring-1 focus:ring-ring/20"
        aria-label="Search tasks"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
