'use client';

import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '@/lib/types';
import { RiskScore } from './RiskScore';
import { Disclaimer } from '../shared/Disclaimer';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Link2, 
  Globe, 
  BrainCircuit,
  Languages,
  Dna,
  FileSearch,
  Users,
  Shield,
  Send,
  Lock,
  UserX,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset?: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'TRUST_REPORT' | 'SCAM_DNA' | 'FAMILY_GUARD'>('TRUST_REPORT');
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedFamilyCard, setCopiedFamilyCard] = useState(false);

  const copyFullReport = () => {
    const textReport = `ScamShield Threat Investigation Report
Score: ${result.riskScore}/100 [${result.riskLevel}]
Language: ${result.languageDetected || 'English'}
Summary: ${result.summary}

AI & Security Explanation:
${result.explanation}

Detected Technical & Psychological Indicators:
${result.detectedIndicators.map(i => `- [${i.severity}] ${i.title}: ${i.description}`).join('\n')}

Recommended Protective Actions:
${result.recommendations.map(r => `- ${r}`).join('\n')}

Disclaimer: Results are advisory. Independently verify suspicious communications.`;

    navigator.clipboard.writeText(textReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const copyFamilyAdvisoryCard = () => {
    if (result.familyGuard?.shareableSummaryText) {
      navigator.clipboard.writeText(result.familyGuard.shareableSummaryText);
      setCopiedFamilyCard(true);
      setTimeout(() => setCopiedFamilyCard(false), 2500);
    }
  };

  const scamDna = result.scamDna;
  const trustReport = result.trustReport;
  const familyGuard = result.familyGuard;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Row & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#23334C]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Scan ID: {result.id}</span>
          {result.languageDetected && (
            <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#111C30] border border-[#23334C] text-slate-300">
              <Languages className="w-3.5 h-3.5 text-primary" />
              {result.languageDetected}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyFullReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111C30] hover:bg-[#17253f] border border-[#23334C] text-xs font-medium text-slate-300 transition-colors"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedReport ? 'Report Copied' : 'Copy Full Investigation'}</span>
          </button>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-medium text-primary transition-colors"
            >
              Scan Another Message
            </button>
          )}
        </div>
      </div>

      {/* 1. Primary Risk Score Gauge */}
      <RiskScore
        score={result.riskScore}
        riskLevel={result.riskLevel}
        confidence={result.confidence}
      />

      {/* 2. Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0D1525] border border-[#23334C] overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('TRUST_REPORT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'TRUST_REPORT'
              ? 'bg-primary text-[#080D18] shadow-glow-primary'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>Trust Investigation Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SCAM_DNA')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'SCAM_DNA'
              ? 'bg-primary text-[#080D18] shadow-glow-primary'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>Scam DNA Engine</span>
          {scamDna && scamDna.detectedCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'SCAM_DNA' ? 'bg-[#080D18] text-primary' : 'bg-primary/20 text-primary'
            }`}>
              {scamDna.detectedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('FAMILY_GUARD')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'FAMILY_GUARD'
              ? 'bg-primary text-[#080D18] shadow-glow-primary'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Family Guard (Simple Mode)</span>
        </button>
      </div>

      {/* TAB 1: TRUST INVESTIGATION REPORT */}
      {activeTab === 'TRUST_REPORT' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Summary & AI Explanation */}
          <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#111C30] to-[#0D1525] relative overflow-hidden shadow-glow-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-base">Explainable Security Analysis</h3>
              </div>
              {result.isAiEnhanced ? (
                <span className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Verified
                </span>
              ) : (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  Heuristic Threat Classifier
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#080D18]/60 border border-[#23334C]/80">
                <p className="text-sm font-medium text-primary leading-relaxed">
                  {result.summary}
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Distinguished Findings: Evidence vs Warning Signs vs AI Interpretation */}
          {trustReport && (
            <div className="p-5 rounded-2xl border border-[#23334C] bg-[#111C30]/80 space-y-4">
              <div className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-secondary" />
                <h3 className="text-sm font-bold text-white">Unified Findings Breakdown</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* 1. Observed Evidence */}
                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. Observed Evidence (Facts)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {trustReport.distinguishedFindings.observedEvidence.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed font-mono text-[11px]">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Possible Warning Signs */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2. Possible Warning Signs</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {trustReport.distinguishedFindings.possibleWarningSigns.length === 0 ? (
                      <li className="text-slate-400 italic text-[11px]">No heuristic alarms triggered.</li>
                    ) : (
                      trustReport.distinguishedFindings.possibleWarningSigns.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* 3. AI Interpretation */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wide">
                    <BrainCircuit className="w-4 h-4" />
                    <span>3. AI Interpretation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {trustReport.distinguishedFindings.aiInterpretation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Identity & Impersonation Assessment */}
          {trustReport?.identityAssessment && (
            <div className="p-5 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Identity & Sender Assessment</h3>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-bold ${
                  trustReport.identityAssessment.impersonationLikelihood === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : trustReport.identityAssessment.impersonationLikelihood === 'SUSPICIOUS'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  Impersonation Risk: {trustReport.identityAssessment.impersonationLikelihood}
                </span>
              </div>

              {trustReport.identityAssessment.claimedEntity && (
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="text-slate-400">Claimed Organization:</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-[#080D18] border border-[#23334C]">
                    {trustReport.identityAssessment.claimedEntity}
                  </span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">Verification Source:</span>
                <p className="leading-relaxed font-mono text-[11px] text-amber-300/90">
                  {trustReport.identityAssessment.verificationSource}
                </p>
              </div>

              {trustReport.identityAssessment.warningSigns.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-300">Identity Red Flags:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {trustReport.identityAssessment.warningSigns.map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-red-300">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Technical Link Analysis */}
          {result.extractedUrls.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Technical Hyperlink Analysis ({result.extractedUrls.length})
              </h3>

              <div className="grid gap-3">
                {result.extractedUrls.map((urlFinding, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[#23334C] bg-[#111C30]/90 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300 break-all">
                        <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-primary font-semibold">{urlFinding.url}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        urlFinding.riskScore >= 40 ? 'bg-red-500/15 text-red-300 border border-red-500/30' :
                        urlFinding.riskScore >= 20 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        URL Risk: {urlFinding.riskScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 bg-[#080D18] p-2.5 rounded-lg border border-[#23334C]">
                      <div>
                        <span className="text-slate-400">Protocol: </span>
                        <span className={urlFinding.isHttps ? 'text-emerald-400' : 'text-red-400'}>
                          {urlFinding.protocol}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">IP Host: </span>
                        <span className={urlFinding.isIpAddress ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {urlFinding.isIpAddress ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Shortener: </span>
                        <span className={urlFinding.isShortener ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                          {urlFinding.isShortener ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Suspicious TLD: </span>
                        <span className={urlFinding.isSuspiciousTld ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {urlFinding.isSuspiciousTld ? 'YES' : 'NO'}
                        </span>
                      </div>
                    </div>

                    {urlFinding.flags.length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-300">
                        {urlFinding.flags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-amber-300/90">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Protective Action Playbook */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Recommended Protective Actions</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider text-[10px]">Immediate Steps:</span>
                <ul className="space-y-2 text-xs text-slate-200">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {trustReport?.recommendedProtectiveActions.reportingChannels && (
                <div className="pt-2 border-t border-emerald-500/20 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 text-[11px]">Official Cyber Crime Reporting Helplines:</span>
                  <ul className="space-y-1 text-xs text-slate-400 font-mono text-[11px]">
                    {trustReport.recommendedProtectiveActions.reportingChannels.map((channel, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-primary">
                        <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{channel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCAM DNA ENGINE */}
      {activeTab === 'SCAM_DNA' && scamDna && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#23334C]">
              <div className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-white">Scam DNA Psychological Manipulation Engine</h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Intensity:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                  scamDna.manipulationIntensity === 'SEVERE'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : scamDna.manipulationIntensity === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {scamDna.manipulationIntensity}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ScamShield's Scam DNA engine analyzes the psychological levers used in this message.
              <strong className="text-white"> Strict Rule:</strong> Techniques are marked as <span className="text-amber-400 font-mono">DETECTED</span> strictly when supporting textual evidence is identified in the message.
            </p>
          </div>

          {/* Grid of 8 Psychological Techniques */}
          <div className="grid md:grid-cols-2 gap-4">
            {scamDna.techniques.map((tech) => {
              const isDetected = tech.detected;

              return (
                <div
                  key={tech.id}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isDetected
                      ? 'border-amber-500/40 bg-amber-950/10 shadow-sm'
                      : 'border-[#23334C] bg-[#080D18]/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className={`font-bold text-xs ${isDetected ? 'text-amber-300' : 'text-slate-300'}`}>
                        {tech.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {tech.simpleExplanation}
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 font-bold ${
                      isDetected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isDetected ? 'DETECTED' : 'NOT OBSERVED'}
                    </span>
                  </div>

                  {isDetected && tech.supportingEvidence && (
                    <div className="p-2.5 rounded-lg bg-[#080D18] border border-amber-500/20 text-xs font-mono space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Supporting Evidence Snippet:</span>
                      <p className="text-amber-300 text-[11px] font-semibold">
                        {tech.supportingEvidence}
                      </p>
                    </div>
                  )}

                  {isDetected && (
                    <p className="text-[10px] text-slate-400 italic border-t border-[#23334C]/60 pt-2">
                      <strong className="text-slate-300 font-mono">Mechanism: </strong>
                      {tech.psychologicalMechanism}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FAMILY GUARD (SIMPLE MODE) */}
      {activeTab === 'FAMILY_GUARD' && familyGuard && (
        <div className="space-y-6 animate-fadeIn">
          {/* Family Guard Header Banner */}
          <div className={`p-6 rounded-2xl border text-slate-100 space-y-4 ${
            familyGuard.safetyRating === 'DANGER'
              ? 'border-red-500/40 bg-gradient-to-br from-red-950/30 to-[#111C30]'
              : familyGuard.safetyRating === 'CAUTION'
              ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-[#111C30]'
              : 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-[#111C30]'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  familyGuard.safetyRating === 'DANGER' ? 'bg-red-500/20 text-red-400' :
                  familyGuard.safetyRating === 'CAUTION' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{familyGuard.headline}</h3>
                  <p className="text-xs text-slate-300">Simplified, Jargon-Free Explanation for Family Members</p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyFamilyAdvisoryCard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-[#080D18] font-bold text-xs hover:opacity-90 transition-all shadow-glow-primary"
              >
                {copiedFamilyCard ? <Check className="w-4 h-4 text-[#080D18]" /> : <Send className="w-4 h-4 text-[#080D18]" />}
                <span>{copiedFamilyCard ? 'Advisory Copied!' : 'Copy WhatsApp Safety Advisory'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#080D18]/80 border border-[#23334C] text-sm text-slate-200 leading-relaxed font-medium">
              {familyGuard.friendlyExplanation}
            </div>
          </div>

          {/* Simple Bullet Lists */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* What You Should Do */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                What You Should Do (Safe Steps)
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {familyGuard.whatYouShouldDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Must NEVER Do */}
            <div className="p-5 rounded-2xl border border-red-500/30 bg-red-950/10 space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                What You Must NEVER Do (Golden Safety Rules)
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {familyGuard.whatYouMustNeverDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed font-semibold text-red-200">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  );
};
