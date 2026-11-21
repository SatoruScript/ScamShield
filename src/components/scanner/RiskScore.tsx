import React from 'react';
import { RiskLevel } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskScoreProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence?: 'LOW' | 'MEDIUM' | 'HIGH';
  size?: 'sm' | 'md' | 'lg';
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  riskLevel,
  confidence = 'HIGH',
  size = 'md',
}) => {
  // SVG circular gauge calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColorDetails = () => {
    switch (riskLevel) {
      case 'HIGH':
        return {
          stroke: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.4)',
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          title: 'High Risk Threat',
          sub: 'Multiple compounding fraud indicators detected',
        };
      case 'MEDIUM':
        return {
          stroke: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          title: 'Medium Suspicion',
          sub: 'Caution advised; deceptive elements present',
        };
      case 'LOW':
      default:
        return {
          stroke: '#22C55E',
          glow: 'rgba(34, 197, 94, 0.4)',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          title: 'Low Risk',
          sub: 'No classic scam or phishing signatures detected',
        };
    }
  };

  const details = getColorDetails();

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border ${details.border} ${details.bg} relative overflow-hidden`}>
      {/* Radial Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#23334C"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={details.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${details.glow})`,
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {score}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      {/* Description breakdown */}
      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className={`text-xl font-bold ${details.text} flex items-center gap-2`}>
            {riskLevel === 'HIGH' && <ShieldAlert className="w-5 h-5 text-red-400" />}
            {riskLevel === 'MEDIUM' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {riskLevel === 'LOW' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            {details.title}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111C30] border border-[#23334C] text-slate-400">
            Confidence: {confidence}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {details.sub}
        </p>

        <p className="text-xs text-slate-400">
          Transparent heuristic score calculated from verified linguistic indicators, domain checks, and pressure triggers.
        </p>
      </div>
    </div>
  );
};
