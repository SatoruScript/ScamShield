'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { SAMPLE_MESSAGES } from '@/lib/sampleMessages';

export const QuickScanner: React.FC = () => {
  const router = useRouter();
  const [quickText, setQuickText] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    // Store in sessionStorage or query param and navigate to scanner
    sessionStorage.setItem('scamshield_quick_text', quickText.trim());
    router.push('/scanner');
  };

  const handleSelectPreset = (text: string) => {
    sessionStorage.setItem('scamshield_quick_text', text);
    router.push('/scanner');
  };

  return (
    <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#111C30] via-[#0D1525] to-[#111C30] space-y-4 shadow-glow-primary/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Quick Threat Scan
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 uppercase">
                Instant
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste any suspicious SMS, message snippet, or link for rapid heuristic analysis.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleQuickSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            placeholder="e.g. Your SBI account will be suspended today! Verify your KYC immediately at http://sbi-kyc-verify.xyz..."
            rows={3}
            className="w-full p-3.5 rounded-xl bg-[#080D18] border border-[#23334C] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400">Quick tests:</span>
            <button
              type="button"
              onClick={() => handleSelectPreset(SAMPLE_MESSAGES[0].text)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#080D18] hover:bg-[#17253f] border border-[#23334C] text-slate-300 transition-colors"
            >
              Bank KYC SMS
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(SAMPLE_MESSAGES[1].text)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#080D18] hover:bg-[#17253f] border border-[#23334C] text-slate-300 transition-colors"
            >
              India Post Scam
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(SAMPLE_MESSAGES[4].text)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#080D18] hover:bg-[#17253f] border border-[#23334C] text-slate-300 transition-colors"
            >
              Assamese KYC
            </button>
          </div>

          <button
            type="submit"
            disabled={!quickText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080D18] font-bold text-xs hover:opacity-90 disabled:opacity-40 transition-all shadow-glow-primary"
          >
            <span>Scan in Message Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
