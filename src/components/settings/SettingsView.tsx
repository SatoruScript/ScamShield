'use client';

import React, { useState, useEffect } from 'react';
import { 
  getPrivacySettings, 
  savePrivacySettings, 
  clearAllScanHistory, 
  PrivacySettings 
} from '@/lib/history';
import { 
  Settings, 
  Cpu, 
  Shield, 
  Trash2, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Info,
  Layers,
  Terminal
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [privacy, setPrivacy] = useState<PrivacySettings>({ storeFullMessage: false });
  const [clearedMessage, setClearedMessage] = useState(false);

  useEffect(() => {
    setPrivacy(getPrivacySettings());
  }, []);

  const handleToggleStoreFull = () => {
    const next = { storeFullMessage: !privacy.storeFullMessage };
    setPrivacy(next);
    savePrivacySettings(next);
  };

  const handleClearHistory = () => {
    clearAllScanHistory();
    setClearedMessage(true);
    setTimeout(() => setClearedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Telemetry</h1>
          <p className="text-xs text-slate-400">
            Configure engine parameters, inspect AI runtime telemetry, and manage local storage privacy.
          </p>
        </div>
      </div>

      {/* Engine Architecture Status */}
      <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-white">Hybrid Detection Architecture</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            OPERATIONAL
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Tier 1: Heuristic Engine</span>
              <span className="text-emerald-400 font-mono text-[10px]">Active</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Deterministic scoring engine evaluating 10+ scam categories, regex signatures, and multi-lingual regional keywords (English, Hindi, Assamese).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-slate-200">Tier 2: Explainable AI</span>
              </div>
              <span className="text-primary font-mono text-[10px]">Gemini API</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Powered by Google Gemini (@google/genai SDK) via Next.js server-side API routes. Transforms technical heuristics into plain language guidance.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#080D18]/60 border border-[#23334C] text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            Model selection is configurable via server environment variable <code className="text-primary font-mono">GEMINI_MODEL</code>. Default: <code className="text-primary font-mono">gemini-2.5-flash</code>.
          </span>
        </div>
      </div>

      {/* Local Storage Privacy Controls */}
      <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-secondary" />
          <h3 className="text-sm font-bold text-white">Device Privacy & Local Storage</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#080D18] border border-[#23334C]">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">Store Full Message in LocalStorage</span>
              <p className="text-slate-400 text-[11px]">
                When disabled (default), only high-level threat snippets and scores are saved locally on this browser.
              </p>
            </div>
            <button
              onClick={handleToggleStoreFull}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors shrink-0 ${
                privacy.storeFullMessage
                  ? 'bg-primary text-[#080D18]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {privacy.storeFullMessage ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#080D18] border border-[#23334C]">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">Purge Local Device Cache</span>
              <p className="text-slate-400 text-[11px]">
                Permanently wipes all locally cached scan logs, telemetry stats, and preferences.
              </p>
            </div>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{clearedMessage ? 'Cache Purged!' : 'Purge Cache'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hackathon Project Metadata */}
      <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          Hackathon Project Specification
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C]">
            <span className="text-slate-400 text-[10px] uppercase">Hackathon</span>
            <p className="text-slate-200 font-semibold mt-0.5">PromptWars 2026</p>
          </div>
          <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C]">
            <span className="text-slate-400 text-[10px] uppercase">Host</span>
            <p className="text-slate-200 font-semibold mt-0.5">Guwahati Univ ANIC</p>
          </div>
          <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C]">
            <span className="text-slate-400 text-[10px] uppercase">Framework</span>
            <p className="text-primary font-semibold mt-0.5">Next.js App Router</p>
          </div>
          <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C]">
            <span className="text-slate-400 text-[10px] uppercase">AI Provider</span>
            <p className="text-secondary font-semibold mt-0.5">Google Gemini GenAI</p>
          </div>
        </div>
      </div>
    </div>
  );
};
