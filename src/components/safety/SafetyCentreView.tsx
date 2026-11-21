'use client';

import React, { useState } from 'react';
import { SIMULATOR_SCENARIOS } from '@/lib/simulatorScenarios';
import { REGIONAL_THREAT_LIBRARY } from '@/lib/regionalThreats';
import { 
  GraduationCap, 
  ShieldCheck, 
  AlertTriangle, 
  Gamepad2, 
  Globe, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  RotateCcw,
  Languages,
  Shield,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const SafetyCentreView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'REGIONAL' | 'GUIDES'>('SIMULATOR');

  // Simulator State
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [simIndex, setSimIndex] = useState(0);
  const [simScore, setSimScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);

  // Regional Library State
  const [selectedLang, setSelectedLang] = useState<'ALL' | 'Assamese' | 'Bengali' | 'Hindi' | 'English'>('ALL');

  // Defense Guides State
  const [expandedGuideIndex, setExpandedGuideIndex] = useState<number | null>(0);

  // Filtered simulator questions
  const filteredScenarios = SIMULATOR_SCENARIOS.filter(s => 
    difficultyFilter === 'ALL' ? true : s.difficulty === difficultyFilter
  );

  const currentScenario = filteredScenarios[simIndex] || filteredScenarios[0];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentScenario) return;
    setIsAnswerSubmitted(true);
    const chosen = currentScenario.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setSimScore(prev => prev + currentScenario.points);
    }
  };

  const handleNextScenario = () => {
    if (simIndex + 1 < filteredScenarios.length) {
      setSimIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setSimCompleted(true);
    }
  };

  const handleRestartSim = () => {
    setSimIndex(0);
    setSimScore(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setSimCompleted(false);
  };

  // Filtered regional threat library
  const filteredRegionalThreats = REGIONAL_THREAT_LIBRARY.filter(t => 
    selectedLang === 'ALL' ? true : t.language === selectedLang
  );

  const defenseModules = [
    {
      id: 'phishing',
      title: 'How Modern Phishing & Smishing Operates',
      summary: 'Attackers craft deceptive SMS or WhatsApp messages designed to direct victims to clone websites.',
      keyTakeaways: [
        'Phishing websites replicate original bank logos and forms with pixel-perfect visual fidelity.',
        'Attackers leverage lookalike domain names (e.g., sbi-verify.xyz instead of onlinesbi.sbi).',
        'Once entered, login IDs, passwords, and 2FA tokens are harvested in real-time by the attacker.',
      ],
      goldenRule: 'Never tap a link inside an unsolicited message to log into an account. Always use the official mobile app or type the verified domain manually.',
    },
    {
      id: 'otp_fraud',
      title: 'OTP & 2-Factor Authentication Protection',
      summary: 'Why legitimate institutions strictly NEVER ask for OTPs, PINs, or security codes.',
      keyTakeaways: [
        'An OTP is the final cryptographic barrier protecting your financial account.',
        'Fraudsters invent pretexts: "To cancel unauthorized debit", "To upgrade credit limit", "To complete KYC".',
        'Sharing an OTP immediately authorizes the attacker’s pending transaction or session takeover.',
      ],
      goldenRule: 'Treat your OTP like your ATM PIN. No bank employee, police officer, or government official has any legitimate reason to ask for it.',
    },
    {
      id: 'digital_arrest',
      title: 'Digital Arrest & Law Enforcement Impersonation',
      summary: 'Understanding virtual police extortion and "CBI / Customs" video call hoaxes.',
      keyTakeaways: [
        'Supreme Court & MHA mandate: "Digital Arrest" does not exist under Indian law.',
        'Law enforcement never conducts trials or demands money transfers over WhatsApp or Skype.',
        'Call 1930 immediately if you receive extortion threats from fake officers.',
      ],
      goldenRule: 'If someone threatens you with arrest or asset seizure over video call, DISCONNECT immediately and report to local police or 1930.',
    },
    {
      id: 'delivery_traps',
      title: 'Fake Courier & Postal Delivery Failures',
      summary: 'Postal smishing targeting parcel anticipation (India Post, BlueDart, DHL, FedEx).',
      keyTakeaways: [
        'Claims an undelivered parcel due to an incomplete street address.',
        'Directs the recipient to pay a small fee (e.g., Rs 5 or Rs 25) to reschedule.',
        'The fake payment gateway is designed to steal complete debit/credit card numbers and CVVs.',
      ],
      goldenRule: 'Check tracking numbers exclusively on the official postal website (e.g., indiapost.gov.in) rather than clicking links inside SMS notifications.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23334C]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Cybersecurity Awareness & Education Platform</h1>
            <p className="text-xs text-slate-400">
              Interactive threat simulation drills, regional scam intelligence, and defense playbooks.
            </p>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111C30] border border-[#23334C] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('SIMULATOR')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'SIMULATOR'
                ? 'bg-primary text-[#080D18] shadow-glow-primary'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Scam Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REGIONAL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'REGIONAL'
                ? 'bg-primary text-[#080D18] shadow-glow-primary'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Regional Library</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GUIDES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'GUIDES'
                ? 'bg-primary text-[#080D18] shadow-glow-primary'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Defense Guides</span>
          </button>
        </div>
      </div>

      {/* FEATURE 3: SCAM SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#111C30] border border-[#23334C]">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Interactive Scam Defense Training Drill</h3>
                <p className="text-[11px] text-slate-400">Safe, fictional examples designed to train critical recognition skills.</p>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">Filter:</span>
              {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setDifficultyFilter(diff);
                    setSimIndex(0);
                    setSelectedOptionId(null);
                    setIsAnswerSubmitted(false);
                    setSimCompleted(false);
                  }}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    difficultyFilter === diff
                      ? 'bg-primary text-[#080D18]'
                      : 'bg-[#080D18] text-slate-400 border border-[#23334C] hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {!simCompleted && currentScenario ? (
            <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-6">
              {/* Progress & Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#23334C] text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">Scenario {simIndex + 1} of {filteredScenarios.length}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    currentScenario.difficulty === 'ADVANCED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    currentScenario.difficulty === 'INTERMEDIATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {currentScenario.difficulty} ({currentScenario.points} pts)
                  </span>
                </div>

                <div className="text-primary font-bold">
                  Score: {simScore} Points
                </div>
              </div>

              {/* Fictional Scenario Box */}
              <div className="p-5 rounded-xl bg-[#080D18] border border-[#23334C] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-white text-sm">{currentScenario.scenarioTitle}</span>
                  <span className="font-mono text-[11px] text-amber-400">{currentScenario.senderProfile}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111C30] border border-[#23334C] font-mono text-xs text-slate-200 leading-relaxed">
                  "{currentScenario.messageText}"
                </div>

                {/* Suspicious Indicators List */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Suspicious Technical Indicators in this message:</span>
                  <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                    {currentScenario.suspiciousIndicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-amber-300/90 text-[11px]">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Question & Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white leading-relaxed">
                  ❓ {currentScenario.question}
                </h3>

                <div className="space-y-2.5">
                  {currentScenario.options.map((opt, optIdx) => {
                    let optionClass = 'border-[#23334C] bg-[#080D18]/80 text-slate-300 hover:border-primary/40';

                    if (isAnswerSubmitted) {
                      if (opt.isCorrect) {
                        optionClass = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 font-semibold';
                      } else if (selectedOptionId === opt.id) {
                        optionClass = 'border-red-500/50 bg-red-950/30 text-red-300';
                      } else {
                        optionClass = 'border-[#23334C] bg-[#080D18]/40 text-slate-500 opacity-60';
                      }
                    } else if (selectedOptionId === opt.id) {
                      optionClass = 'border-primary bg-primary/10 text-white';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full p-4 rounded-xl border text-xs text-left transition-all flex items-start gap-3 ${optionClass}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="space-y-1">
                          <span className="leading-relaxed block">{opt.text}</span>
                          {isAnswerSubmitted && selectedOptionId === opt.id && (
                            <p className="text-[11px] text-slate-300 pt-1 font-normal italic border-t border-[#23334C]">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button Row */}
              <div className="flex justify-end pt-2 border-t border-[#23334C]">
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOptionId}
                    className="px-6 py-2.5 rounded-xl bg-primary text-[#080D18] font-bold text-xs hover:opacity-90 disabled:opacity-40 shadow-glow-primary"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="px-6 py-2.5 rounded-xl bg-primary text-[#080D18] font-bold text-xs hover:opacity-90 shadow-glow-primary"
                  >
                    {simIndex + 1 < filteredScenarios.length ? 'Next Scenario' : 'View Drill Summary'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Completion Summary */
            <div className="p-8 rounded-2xl border border-[#23334C] bg-[#111C30] text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Scam Defense Training Drill Completed!</h3>
                <p className="text-xs text-slate-400">
                  Total Score Accumulated: <span className="text-primary font-mono font-bold text-base">{simScore} Points</span>
                </p>
              </div>

              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                You have completed the cybersecurity scenario drill. Always remember: real institutions never ask for passwords, OTPs, or urgent payments over SMS or video calls.
              </p>

              <button
                type="button"
                onClick={handleRestartSim}
                className="px-6 py-2.5 rounded-xl bg-primary text-[#080D18] font-bold text-xs hover:opacity-90 shadow-glow-primary"
              >
                Restart Drill
              </button>
            </div>
          )}
        </div>
      )}

      {/* FEATURE 4: REGIONAL INTELLIGENCE LIBRARY */}
      {activeTab === 'REGIONAL' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#111C30] border border-[#23334C]">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-white">Educational Regional Scam Awareness Library</h3>
                <p className="text-[11px] text-slate-400">Verifiable threat playbooks documented across regional languages.</p>
              </div>
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">Language:</span>
              {(['ALL', 'Assamese', 'Bengali', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    selectedLang === lang
                      ? 'bg-primary text-[#080D18]'
                      : 'bg-[#080D18] text-slate-400 border border-[#23334C] hover:text-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Threat Cards List */}
          <div className="grid gap-5">
            {filteredRegionalThreats.map((threat) => (
              <div
                key={threat.id}
                className="p-5 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4 hover:border-slate-600 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#23334C]">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-bold mr-2 uppercase">
                      {threat.language}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{threat.region}</span>
                    <h3 className="text-base font-bold text-white mt-1">{threat.threatTitle}</h3>
                  </div>

                  <span className="text-xs text-slate-400 bg-[#080D18] px-3 py-1 rounded-lg border border-[#23334C]">
                    Target: {threat.targetDemographic}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[10px]">Modus Operandi:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {threat.modusOperandi}
                  </p>
                </div>

                {/* Deceptive Phrases Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[10px]">Deceptive Phrases & Regional Trigger Analysis:</span>
                  <div className="grid gap-2">
                    {threat.deceptivePhrases.map((phrase, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#080D18] border border-[#23334C] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-sm">"{phrase.originalText}"</span>
                          <span className="text-[10px] font-mono text-slate-400">Intent: {phrase.scamIntent}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic">
                          Translation/Transliteration: {phrase.transliterationOrTranslation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Advisory Source & Official Remedies */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>Verified Official Advisory: {threat.officialAdvisorySource}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {threat.verifiedRemedies.map((remedy, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-emerald-200">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEFENSE GUIDES */}
      {activeTab === 'GUIDES' && (
        <div className="space-y-4 animate-fadeIn">
          {defenseModules.map((mod, idx) => {
            const isExpanded = expandedGuideIndex === idx;

            return (
              <div
                key={mod.id}
                className="p-5 rounded-2xl border border-[#23334C] bg-[#111C30] transition-all space-y-4"
              >
                <div
                  type="button"
                  onClick={() => setExpandedGuideIndex(isExpanded ? null : idx)}
                  className="flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.summary}</p>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-2 border-t border-[#23334C]/80 space-y-3.5 animate-fadeIn">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Key Deceptive Mechanics:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {mod.keyTakeaways.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-400 uppercase tracking-wide text-[10px]">
                        <ShieldCheck className="w-4 h-4" />
                        Golden Defense Rule
                      </span>
                      <p className="leading-relaxed">{mod.goldenRule}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
