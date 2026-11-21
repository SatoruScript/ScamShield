'use client';

import React, { useState } from 'react';
import { analyzeUrlSafety, DetailedUrlAnalysis } from '@/lib/urlAnalyzer';
import { Disclaimer } from '../shared/Disclaimer';
import { 
  Link2, 
  Search, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Layers, 
  Globe, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';

const SAMPLE_URLS = [
  {
    label: 'Fake SBI KYC Domain',
    url: 'http://sbi-kyc-update.xyz/login?ref=sms',
    risk: 'HIGH',
  },
  {
    label: 'Raw IP Host Link',
    url: 'http://185.220.101.5/banking/verify-card',
    risk: 'HIGH',
  },
  {
    label: 'URL Shortener Redirect',
    url: 'https://bit.ly/urgent-package-reschedule',
    risk: 'MEDIUM',
  },
  {
    label: 'Multi-Level Deceptive Subdomain',
    url: 'https://verify.account.sbi.com.security-server.top/ebank',
    risk: 'HIGH',
  },
  {
    label: 'Official State Bank of India Domain',
    url: 'https://onlinesbi.sbi/personal/index.html',
    risk: 'LOW',
  },
];

export const UrlAnalyzerView: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<DetailedUrlAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = (target?: string) => {
    const urlToTest = (target !== undefined ? target : inputUrl).trim();
    if (!urlToTest) {
      setError('Please provide a web link or domain to inspect.');
      return;
    }
    setError(null);
    const result = analyzeUrlSafety(urlToTest);
    setAnalysis(result);
  };

  const handleClear = () => {
    setInputUrl('');
    setAnalysis(null);
    setError(null);
  };

  const selectSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    handleAnalyze(sampleUrl);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">URL & Domain Inspector</h1>
            <p className="text-xs text-slate-400">
              Deep-inspect suspicious links safely without making network requests or loading malicious payloads.
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-5">
        {/* Sample Links Pills */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Test Preset URLs:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSample(sample.url)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#23334C] bg-[#080D18]/80 hover:bg-[#17253f] hover:border-primary/40 text-slate-300 transition-all flex items-center gap-1.5"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  sample.risk === 'HIGH' ? 'bg-red-400' :
                  sample.risk === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious link (e.g., http://sbi-kyc.xyz or bit.ly/...)"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#080D18] border border-[#23334C] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary text-xs font-mono transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {inputUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="p-3 rounded-xl border border-[#23334C] bg-[#080D18] hover:bg-[#17253f] text-slate-400 hover:text-white transition-colors"
                title="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080D18] font-bold text-xs hover:opacity-95 transition-all shadow-glow-primary"
            >
              <Search className="w-4 h-4" />
              <span>Inspect Link</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        )}
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Risk Level Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            analysis.riskLevel === 'HIGH' ? 'bg-red-950/20 border-red-500/40 text-red-300' :
            analysis.riskLevel === 'MEDIUM' ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' :
            'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className={`p-3 rounded-2xl ${
                analysis.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                analysis.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {analysis.riskLevel === 'HIGH' && <ShieldAlert className="w-7 h-7" />}
                {analysis.riskLevel === 'MEDIUM' && <AlertTriangle className="w-7 h-7" />}
                {analysis.riskLevel === 'LOW' && <ShieldCheck className="w-7 h-7" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {analysis.riskLevel} Risk URL Assessment
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {analysis.explanation}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-3xl font-extrabold font-mono text-white">
                {analysis.riskScore}
              </span>
              <span className="text-xs text-slate-400 font-mono"> / 100</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Heuristic Threat Score</p>
            </div>
          </div>

          {/* URL Anatomy Breakdown */}
          <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              URL Structural Anatomy Breakdown
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Protocol</span>
                <p className={`font-bold ${analysis.protocol === 'https:' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analysis.protocol}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Root Domain</span>
                <p className="font-bold text-primary truncate" title={analysis.domainName}>
                  {analysis.domainName || 'N/A'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Subdomains</span>
                <p className="font-bold text-slate-200 truncate">
                  {analysis.subdomains.length > 0 ? analysis.subdomains.join('.') : 'None'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">TLD Extension</span>
                <p className="font-bold text-amber-300">
                  .{analysis.tld || 'none'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] uppercase">Path & Query</span>
                <p className="font-bold text-slate-300 truncate" title={analysis.pathname + analysis.search}>
                  {analysis.pathname || '/'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Security Checks Checklist */}
          <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Automated Link Security Checks
            </h3>

            <div className="grid gap-2.5">
              {analysis.indicators.map((ind) => (
                <div
                  key={ind.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    ind.passed
                      ? 'bg-[#080D18]/50 border-[#23334C]'
                      : ind.severity === 'HIGH'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className={`p-1 rounded-lg shrink-0 mt-0.5 ${
                    ind.passed ? 'bg-emerald-500/20 text-emerald-400' :
                    ind.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {ind.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${ind.passed ? 'text-slate-200' : 'text-white'}`}>
                        {ind.title}
                      </h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        ind.passed ? 'bg-emerald-500/20 text-emerald-300' :
                        ind.severity === 'HIGH' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {ind.passed ? 'Passed' : 'Flagged'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-2.5">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
              Safety Advice For This Link:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <Disclaimer />
        </div>
      )}
    </div>
  );
};
