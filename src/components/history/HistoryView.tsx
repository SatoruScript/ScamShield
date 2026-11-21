'use client';

import React, { useState, useEffect } from 'react';
import { 
  getScanHistory, 
  deleteScanHistoryItem, 
  clearAllScanHistory, 
  getPrivacySettings, 
  savePrivacySettings 
} from '@/lib/history';
import { ScanHistoryItem, RiskLevel } from '@/lib/types';
import { RiskBadge } from '../scanner/RiskBadge';
import { formatDate } from '@/lib/utils';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  X, 
  ShieldAlert, 
  Download, 
  Filter, 
  ShieldCheck, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [privacySettings, setPrivacySettingsState] = useState({ storeFullMessage: false });

  useEffect(() => {
    setHistory(getScanHistory());
    setPrivacySettingsState(getPrivacySettings());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteScanHistoryItem(id);
    setHistory(getScanHistory());
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    clearAllScanHistory();
    setHistory([]);
    setShowClearConfirm(false);
    setSelectedItem(null);
  };

  const handleTogglePrivacy = () => {
    const updated = { storeFullMessage: !privacySettings.storeFullMessage };
    savePrivacySettings(updated);
    setPrivacySettingsState(updated);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scamshield_scan_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = history.filter((item) => {
    const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
    const matchesQuery = 
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Local Scan Logs</h1>
            <p className="text-xs text-slate-400">
              Browse security scans saved on this device. Fully private and stored in your browser's LocalStorage.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#23334C] bg-[#111C30] hover:bg-[#17253f] text-xs font-medium text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Privacy Mode Banner */}
      <div className="p-4 rounded-xl border border-[#23334C] bg-[#111C30]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-primary shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">Zero-Server Storage Policy: </span>
            <span className="text-slate-400">
              ScamShield does not upload or retain your private messages on any remote server.
            </span>
          </div>
        </div>

        <button
          onClick={handleTogglePrivacy}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white shrink-0 font-medium"
        >
          <span className="text-slate-400">Store full text in LocalStorage:</span>
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
            privacySettings.storeFullMessage ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-slate-800 text-slate-400'
          }`}>
            {privacySettings.storeFullMessage ? 'ENABLED' : 'SNIPPETS ONLY'}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans by keyword or threat description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111C30] border border-[#23334C] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111C30] border border-[#23334C] text-xs">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                riskFilter === lvl
                  ? 'bg-primary text-[#080D18] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-2xl border border-[#23334C] bg-[#111C30]/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-[#23334C] flex items-center justify-center mx-auto text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Matching Scans Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0
              ? 'You have not scanned any messages yet. Visit the Message Scanner to start.'
              : 'Try clearing your search query or risk filters.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-4 rounded-xl border border-[#23334C] bg-[#111C30] hover:border-slate-500 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-1.5 rounded-lg hover:bg-[#080D18] text-slate-400 hover:text-primary transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-200 font-mono bg-[#080D18] p-2.5 rounded-lg border border-[#23334C]/60 truncate">
                "{item.excerpt}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate pr-4">{item.summary}</span>
                <span className="shrink-0 text-primary group-hover:underline">Inspect Report →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl border border-red-500/40 bg-[#111C30] space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Clear All Scan History?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete all {history.length} saved scan records from your browser's local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#23334C] text-xs font-semibold text-slate-300 hover:bg-[#080D18]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 shadow-glow-danger"
              >
                Yes, Delete History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-5">
            <div className="flex items-center justify-between border-b border-[#23334C] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-white text-base">Archived Scan Analysis</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg hover:bg-[#080D18] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assessed Risk:</span>
                <RiskBadge level={selectedItem.riskLevel} score={selectedItem.riskScore} size="lg" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-200 font-mono">{formatDate(selectedItem.timestamp)}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold">Message Text:</span>
                <div className="p-3.5 rounded-xl bg-[#080D18] border border-[#23334C] text-slate-200 font-mono leading-relaxed max-h-48 overflow-y-auto">
                  {selectedItem.fullMessage || selectedItem.excerpt}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold">Executive Summary:</span>
                <p className="text-slate-300 leading-relaxed bg-[#080D18]/60 p-3 rounded-xl border border-[#23334C]">
                  {selectedItem.summary}
                </p>
              </div>

              {selectedItem.recommendations?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold">Safety Recommendations:</span>
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
                className="px-5 py-2.5 rounded-xl bg-primary text-[#080D18] font-bold text-xs hover:opacity-90 shadow-glow-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
