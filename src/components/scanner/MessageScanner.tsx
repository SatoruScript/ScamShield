'use client';

import React, { useState } from 'react';
import { SAMPLE_MESSAGES, SampleMessage } from '@/lib/sampleMessages';
import { AnalysisResult as AnalysisResultType } from '@/lib/types';
import { AnalysisResult } from './AnalysisResult';
import { saveScanToHistory } from '@/lib/history';
import { 
  ShieldAlert, 
  Send, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface MessageScannerProps {
  initialMessage?: string;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({ initialMessage = '' }) => {
  const [message, setMessage] = useState<string>(initialMessage);
  const [sourceType, setSourceType] = useState<'SMS' | 'WHATSAPP' | 'EMAIL' | 'OTHER'>('SMS');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('Initializing scanner...');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  const characterCount = message.length;
  const maxCharacters = 5000;

  const handleSelectSample = (sample: SampleMessage) => {
    setMessage(sample.text);
    setSourceType(sample.source);
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setMessage('');
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please paste or type a message to analyze.');
      return;
    }

    if (message.trim().length < 3) {
      setError('Message is too short. Please enter at least 3 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Multi-phase feedback for polish
    const phases = [
      'Extracting entities & suspicious web links...',
      'Executing deterministic security heuristics...',
      'Synthesizing explainable AI threat breakdown...',
      'Validating safety recommendations...',
    ];

    let phaseIndex = 0;
    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setLoadingPhase(phases[phaseIndex]);
    }, 700);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          sourceType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze message.');
      }

      setResult(data);
      // Save to local history
      saveScanToHistory(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMsg);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form Section */}
      <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Analyze Suspicious Communication
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Paste suspicious SMS, WhatsApp, email, or chat messages for explainable fraud detection.
            </p>
          </div>

          {/* Platform selection pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080D18] border border-[#23334C] text-xs">
            {(['SMS', 'WHATSAPP', 'EMAIL', 'OTHER'] as const).map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => setSourceType(source)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  sourceType === source
                    ? 'bg-primary text-[#080D18] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Message Quick Pickers */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Try Realistic Examples:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#23334C] bg-[#080D18]/80 hover:bg-[#17253f] hover:border-primary/40 text-slate-300 transition-all flex items-center gap-1.5 group"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  sample.expectedRisk === 'HIGH' ? 'bg-red-400' :
                  sample.expectedRisk === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span className="font-medium group-hover:text-primary transition-colors">{sample.title}</span>
                <span className="text-[10px] text-slate-400">({sample.tag})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious SMS, WhatsApp message, email body, or notification here..."
              rows={5}
              maxLength={maxCharacters}
              className="w-full p-4 rounded-xl bg-[#080D18] border border-[#23334C] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm leading-relaxed transition-all font-mono resize-y"
            />
          </div>

          {/* Textarea Bottom Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono">
              {characterCount} / {maxCharacters} characters
            </span>

            {message && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear text</span>
              </button>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !message.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080D18] font-bold text-sm hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#080D18]" />
                <span>Analyzing Security...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Scan Message Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton & Status */}
      {loading && (
        <div className="p-8 rounded-2xl border border-primary/30 bg-[#111C30] text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="w-6 h-6 text-primary absolute" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Running ScamShield Security Engine</h3>
            <p className="text-xs font-mono text-primary mt-1 animate-pulse">{loadingPhase}</p>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Extracting links, evaluating urgency heuristics, verifying brand mimicry, and synthesizing AI explainability.
          </p>
        </div>
      )}

      {/* Analysis Result Section */}
      {result && !loading && (
        <AnalysisResult result={result} onReset={handleClear} />
      )}
    </div>
  );
};
