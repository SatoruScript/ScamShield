import React from 'react';
import { SystemStats } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Globe, Activity } from 'lucide-react';

interface StatsCardsProps {
  stats: SystemStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Scanned Messages',
      value: stats.totalScans,
      subtitle: 'Processed in current session',
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
    {
      title: 'High-Risk Threats Flagged',
      value: stats.highRiskCount,
      subtitle: 'Critical fraud & phishing signatures',
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    {
      title: 'Suspicious Messages',
      value: stats.mediumRiskCount,
      subtitle: 'Moderate risk / deceptive links',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      title: 'Threat Detection Rate',
      value: `${stats.threatRate}%`,
      subtitle: `${stats.highRiskCount + stats.mediumRiskCount} flags from ${stats.totalScans} scans`,
      icon: ShieldCheck,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[#23334C] bg-[#111C30] hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color} border ${card.border}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
