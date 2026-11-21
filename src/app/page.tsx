'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getScanHistory, calculateStatsFromHistory } from '@/lib/history';
import { ScanHistoryItem, SystemStats } from '@/lib/types';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickScanner } from '@/components/dashboard/QuickScanner';
import { ScamTrends } from '@/components/dashboard/ScamTrends';
import { Disclaimer } from '@/components/shared/Disclaimer';
import { 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Terminal, 
  CheckCircle2,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function DashboardPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalScans: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    urlsAnalyzed: 0,
    threatRate: 0,
  });

  useEffect(() => {
    const loadedHistory = getScanHistory();
    setHistory(loadedHistory);
    setStats(calculateStatsFromHistory(loadedHistory));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden p-6 lg:p-8 rounded-3xl border border-[#23334C] bg-gradient-to-br from-[#111C30] via-[#0D1525] to-[#080D18]">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars 2026 Edition • Guwahati University ANIC</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ScamShield Threat Command Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Don’t fall victim to deceptive bank KYC mandates, fake courier alerts, or psychological coercion. 
              ScamShield analyzes suspicious messages using deterministic security heuristics paired with explainable Gemini AI.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/scanner"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080D18] font-bold text-xs hover:opacity-95 transition-opacity shadow-glow-primary"
              >
                <span>Launch Message Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/url-analyzer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#23334C] bg-[#080D18] hover:bg-[#111C30] text-xs font-semibold text-slate-300 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Inspect URL</span>
              </Link>
            </div>
          </div>

          {/* Quick telemetry badge */}
          <div className="p-5 rounded-2xl border border-[#23334C] bg-[#080D18]/80 text-xs font-mono space-y-2 shrink-0 lg:w-72">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-[#23334C]">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Terminal className="w-4 h-4 text-primary" />
                Engine Telemetry
              </span>
              <span className="text-[10px] text-emerald-400">READY</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Heuristics:</span>
              <span>10 Rules Active</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Multilingual:</span>
              <span>ENG / HIN / ASM</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Privacy Mode:</span>
              <span className="text-emerald-400 font-bold">100% Client-Side</span>
            </div>
          </div>
        </div>

        {/* Ambient background grid */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      </div>

      {/* Real Computed Telemetry Stats */}
      <StatsCards stats={stats} />

      {/* Quick Interactive Scanner Widget */}
      <QuickScanner />

      {/* Recent Scans and Active Threats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity history={history} />
        <ScamTrends />
      </div>

      {/* Bottom Advisory Banner */}
      <Disclaimer />
    </div>
  );
}
