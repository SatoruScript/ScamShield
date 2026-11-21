'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ScanHistoryItem } from '@/lib/types';
import { RiskBadge } from '../scanner/RiskBadge';
import { formatDate } from '@/lib/utils';
import { History, ArrowRight, Eye, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RecentActivityProps {
  history: ScanHistoryItem[];
  onClear?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ history }) => {
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);

  if (history.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-[#23334C] bg-[#111C30]/50 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-[#23334C] flex items-center justify-center mx-auto text-slate-400">
          <History className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">No Analysis History Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your scanned messages will appear here. Start by analyzing a suspicious SMS, WhatsApp message, or email.
          </p>
        </div>
        <Link
          href="/scanner"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-semibold text-primary transition-colors"
        >
          <span>Open Message Scanner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const recentItems = history.slice(0, 5);

  return (
    <>
      <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-white">Recent Security Scans</h3>
          </div>
          <Link
            href="/history"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All ({history.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#23334C]/60">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#080D18]/40 px-2 rounded-xl transition-colors group"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate font-mono">
                  "{item.excerpt}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#080D18] hover:bg-[#17253f] border border-[#23334C] text-xs font-medium text-slate-300 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-[#23334C] bg-[#111C30] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#23334C] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-white text-sm">Archived Scan Details</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg hover:bg-[#080D18] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Risk Assessment:</span>
                <RiskBadge level={selectedItem.riskLevel} score={selectedItem.riskScore} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Scan Timestamp:</span>
                <span className="text-slate-200 font-mono">{formatDate(selectedItem.timestamp)}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Message Excerpt:</span>
                <div className="p-3 rounded-lg bg-[#080D18] border border-[#23334C] text-slate-200 font-mono leading-relaxed">
                  {selectedItem.fullMessage || selectedItem.excerpt}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Summary:</span>
                <p className="text-slate-300 leading-relaxed bg-[#080D18]/50 p-2.5 rounded-lg border border-[#23334C]">
                  {selectedItem.summary}
                </p>
              </div>

              {selectedItem.recommendations?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold">Saved Recommendations:</span>
                  <ul className="space-y-1 text-slate-300 pl-4 list-disc">
                    {selectedItem.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-primary text-[#080D18] font-semibold text-xs hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
