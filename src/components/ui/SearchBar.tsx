'use client';

import React, { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  onOpenAI?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  initialValue = '',
  onSearch,
  onOpenAI,
  placeholder = 'Search places, brands or deals',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full bg-white border border-[#E7E7EC] rounded-2xl shadow-sm focus-within:border-[#5B5CE2] focus-within:ring-4 focus-within:ring-[#5B5CE2]/10 transition-all duration-200 ${className}`}
    >
      <div className="pl-4 pr-2 text-[#6F7078]">
        <Search className="w-5 h-5 stroke-[2]" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 pr-2 text-base text-[#15151A] bg-transparent outline-none placeholder:text-[#6F7078]"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 mr-1 text-[#6F7078] hover:text-[#15151A] rounded-full hover:bg-[#F7F7FA] transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {onOpenAI && (
        <button
          type="button"
          onClick={onOpenAI}
          title="AI Smart Search"
          className="flex items-center gap-1.5 px-3 py-1.5 mr-2 text-xs font-semibold text-[#5B5CE2] bg-[#EEF0FF] hover:bg-[#5B5CE2] hover:text-white rounded-xl transition-all duration-200 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Discover</span>
        </button>
      )}
    </form>
  );
}
