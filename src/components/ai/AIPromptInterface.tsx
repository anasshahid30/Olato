'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Wand2, Search } from 'lucide-react';
import { AIProcessingModal } from './AIProcessingModal';

interface AIPromptInterfaceProps {
  className?: string;
  autoFocus?: boolean;
  theme?: 'dark' | 'light';
}

export function AIPromptInterface({
  className = '',
  autoFocus = false,
  theme = 'dark',
}: AIPromptInterfaceProps) {
  const rotatingPlaceholders = [
    'Find coffee discounts near me',
    'Where can I use my card for a discount?',
    'Show me restaurants with student discounts',
    'Find 20% discounts nearby',
    "What's worth trying around me?",
  ];

  const suggestionChips = [
    '☕ Coffee discounts near me',
    '🎓 Student discounts',
    '💳 Bank card offers',
    '🔥 20%+ OFF nearby',
    '🍽️ Best dinner spots',
  ];

  const [prompt, setPrompt] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activePromptToProcess, setActivePromptToProcess] = useState<string | null>(null);

  // Rotate placeholder text every 3.2 seconds
  useEffect(() => {
    if (isFocused || prompt) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isFocused, prompt, rotatingPlaceholders.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = prompt.trim() || rotatingPlaceholders[placeholderIndex];
    setActivePromptToProcess(finalPrompt);
  };

  const handleChipClick = (chipText: string) => {
    // Strip leading emoji for clean prompt execution
    const cleanText = chipText.replace(/^[\p{Emoji}\s]+/u, '').trim();
    setPrompt(cleanText);
    setActivePromptToProcess(cleanText);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-3.5 ${className}`}>
      {/* Main Command Input Box */}
      <form
        onSubmit={handleSubmit}
        className={`relative group rounded-3xl p-2.5 sm:p-3.5 transition-all duration-300 ${
          isDark
            ? 'bg-[#12131A] border border-[#262738] shadow-2xl text-white'
            : 'bg-white border border-[#E7E7EC] shadow-xl text-[#15151A]'
        } ${
          isFocused
            ? 'border-[#5B5CE2] ring-4 ring-[#5B5CE2]/20 scale-[1.01]'
            : 'hover:border-[#5B5CE2]/40'
        }`}
      >
        {/* Subtle Ambient Edge Glow when focused */}
        <div
          className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#5B5CE2] via-[#10B981] to-[#5B5CE2] opacity-0 transition-opacity duration-500 blur-sm pointer-events-none ${
            isFocused ? 'opacity-35' : 'group-hover:opacity-10'
          }`}
        />

        <div className="relative z-10 flex items-center gap-3">
          {/* AI Sparkle Icon */}
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              isDark
                ? 'bg-[#1A1A28] text-[#5B5CE2] border border-[#5B5CE2]/30'
                : 'bg-[#EEF0FF] text-[#5B5CE2] border border-[#5B5CE2]/20'
            }`}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={rotatingPlaceholders[placeholderIndex]}
            autoFocus={autoFocus}
            className={`w-full bg-transparent text-sm sm:text-base outline-none transition-all ${
              isDark
                ? 'text-white placeholder:text-[#8E90A0]'
                : 'text-[#15151A] placeholder:text-[#8E90A0]'
            }`}
          />

          {/* Action Trigger Button */}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#5B5CE2] hover:bg-[#4B4CCB] text-white font-extrabold text-sm transition-all duration-300 shadow-md shadow-[#5B5CE2]/25 hover:scale-105 shrink-0 cursor-pointer"
          >
            <span>Discover</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1 ${
            isDark ? 'text-[#8E90A0]' : 'text-[#6F7078]'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-[#5B5CE2]" />
          Suggestions:
        </span>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
              isDark
                ? 'bg-[#181924] border border-[#262738] text-[#8E90A0] hover:text-white hover:border-[#5B5CE2] hover:bg-[#1E2030]'
                : 'bg-white border border-[#E7E7EC] text-[#6F7078] hover:text-[#15151A] hover:border-[#5B5CE2] hover:bg-[#F4F3F0] shadow-xs'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Interactive Processing Result Modal */}
      {activePromptToProcess && (
        <AIProcessingModal
          userPrompt={activePromptToProcess}
          onClose={() => setActivePromptToProcess(null)}
        />
      )}
    </div>
  );
}
