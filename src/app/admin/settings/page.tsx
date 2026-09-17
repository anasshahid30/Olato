'use client';

import React, { useState } from 'react';
import { repository } from '@/lib/repository';
import { Button } from '@/components/ui/Button';
import { Bot, RefreshCw, Key, ShieldCheck, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [resetDone, setResetDone] = useState(false);
  const [aiApiKey, setAiApiKey] = useState(process.env.NEXT_PUBLIC_AI_DISCOVERY_KEY || '');

  const handleResetSeedData = () => {
    if (confirm('Reset database state back to default Lahore prototype seed data?')) {
      repository.resetToDefaultSeed();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 2500);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-[1000px]">
      <div>
        <h1 className="text-3xl font-bold text-[#15151A]">Platform & AI Settings</h1>
        <p className="text-sm text-[#6F7078] mt-0.5">
          Configure external AI engine integration parameters and prototype seed database maintenance
        </p>
      </div>

      <div className="space-y-6">
        {/* AI Engine Configuration */}
        <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#5B5CE2] text-white rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#15151A]">AI Natural Discovery API</h3>
              <p className="text-xs text-[#6F7078]">
                Environment Variable: <code className="bg-[#EEF0FF] text-[#5B5CE2] px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_AI_DISCOVERY_KEY</code>
              </p>
            </div>
          </div>

          <p className="text-xs text-[#6F7078] leading-relaxed">
            When an API key is provided, natural language queries parse through an external LLM endpoint. If unconfigured, Olato automatically uses a zero-latency heuristic natural parser.
          </p>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">AI API Key (Optional)</label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#6F7078] absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder="sk-or-gemini-key-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E7EC] bg-[#F7F7FA] text-sm text-[#15151A] focus:bg-white focus:border-[#5B5CE2] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Database Seed Reset */}
        <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EF4444]/10 text-[#EF4444] rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#15151A]">Reset Seed Data</h3>
              <p className="text-xs text-[#6F7078]">Restore original prototype places, discounts, and verification scores</p>
            </div>
          </div>

          <p className="text-xs text-[#6F7078]">
            This action clears custom local edits and re-initializes the application repository with default Lahore seed records.
          </p>

          <Button variant="danger" size="md" onClick={handleResetSeedData} icon={<RefreshCw className="w-4 h-4" />}>
            {resetDone ? 'Reset Complete!' : 'Reset Seed Repository Data'}
          </Button>
        </div>
      </div>
    </div>
  );
}
