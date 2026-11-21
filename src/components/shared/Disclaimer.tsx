import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface DisclaimerProps {
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 text-xs text-slate-400 bg-surface-card/60 border border-surface-border rounded-lg">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Advisory Notice:</strong> Automated AI & heuristic analysis. Always verify important messages via independently confirmed official channels.
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden p-4 rounded-xl border border-surface-border bg-gradient-to-r from-surface-card to-surface/80 text-xs text-slate-400">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">Official Cybersecurity Advisory Notice</p>
          <p className="leading-relaxed">
            ScamShield provides automated security guidance. Results are advisory and cannot guarantee whether a message is genuine or fraudulent. Never disclose OTPs, PINs, or passwords to unverified contacts. Verify sensitive communications through official bank portals or customer care numbers printed on your physical cards.
          </p>
        </div>
      </div>
    </div>
  );
};
