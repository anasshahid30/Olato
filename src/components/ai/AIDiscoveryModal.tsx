'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { parseNaturalLanguageQuery } from '@/lib/ai-service';
import { Sparkles, ArrowRight, Bot, Coffee, UtensilsCrossed, Star } from 'lucide-react';

interface AIDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIDiscoveryModal({ isOpen, onClose }: AIDiscoveryModalProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const samplePrompts = [
    'Quiet café with a good discount near Gulberg valid today',
    'Fine dining restaurant with at least 30% discount for dinner',
    'BOGO deals on artisanal coffee and pastries in DHA',
    'Featured places with verified student discounts near me',
  ];

  const handleExecute = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsProcessing(true);

    const parsed = await parseNaturalLanguageQuery(queryText);

    setIsProcessing(false);
    onClose();

    // Build URL search params
    const params = new URLSearchParams();
    if (parsed.query) params.set('q', parsed.query);
    if (parsed.category && parsed.category !== 'ALL') params.set('cat', parsed.category);
    if (parsed.minDiscount) params.set('minDisc', parsed.minDiscount.toString());
    if (parsed.validToday) params.set('validToday', 'true');
    if (parsed.verifiedOnly) params.set('verifiedOnly', 'true');
    if (parsed.studentOnly) params.set('studentOnly', 'true');

    router.push(`/search?${params.toString()}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Natural Discovery" maxWidth="lg">
      <div className="space-y-5">
        {/* Banner */}
        <div className="p-4 bg-[#EEF0FF] rounded-2xl border border-[#5B5CE2]/20 flex items-start gap-3">
          <div className="p-2.5 bg-[#5B5CE2] text-white rounded-xl shrink-0 mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#15151A]">Describe What You're Craving</h4>
            <p className="text-xs text-[#6F7078] leading-relaxed mt-0.5">
              Type naturally in plain language. Olato’s AI engine interprets your request and maps it to verified local deals in Cafés, Restaurants, or Featured Places.
            </p>
          </div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute(prompt);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Find me a quiet café with a good coffee discount near Gulberg valid today..."
              className="w-full p-4 rounded-2xl border border-[#E7E7EC] bg-[#F7F7FA] text-sm text-[#15151A] focus:bg-white focus:border-[#5B5CE2] focus:ring-4 focus:ring-[#5B5CE2]/10 outline-none transition-all resize-none placeholder:text-[#6F7078]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6F7078]">Strictly maps to Cafés, Restaurants & Featured Places</span>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isProcessing || !prompt.trim()}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {isProcessing ? 'Interpreting...' : 'Discover Deals'}
            </Button>
          </div>
        </form>

        {/* Prompts list */}
        <div className="pt-3 border-t border-[#E7E7EC]">
          <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider block mb-2.5">
            Try these example prompts:
          </span>
          <div className="space-y-2">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(sp);
                  handleExecute(sp);
                }}
                className="w-full text-left p-3 rounded-xl border border-[#E7E7EC] bg-white hover:bg-[#EEF0FF] hover:border-[#5B5CE2]/40 text-xs font-semibold text-[#15151A] transition-all flex items-center justify-between group"
              >
                <span>"{sp}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#5B5CE2] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
