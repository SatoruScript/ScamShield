export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type RegionalLanguage = 'English' | 'Assamese' | 'Hindi' | 'Bengali';

export interface DetectedIndicator {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'URGENCY' | 'CREDENTIALS' | 'FINANCIAL' | 'IMPERSONATION' | 'SUSPICIOUS_LINK' | 'FEAR_TACTIC' | 'UNSOLICITED_OFFER';
  evidence?: string;
  points: number;
}

export interface UrlFinding {
  url: string;
  hostname: string;
  protocol: string;
  isHttps: boolean;
  isIpAddress: boolean;
  isShortener: boolean;
  isSuspiciousTld: boolean;
  hasDeceptiveSubdomain: boolean;
  hasSuspiciousKeywords: boolean;
  hasExcessiveSubdomains: boolean;
  riskScore: number;
  flags: string[];
}

export interface ManipulationTactic {
  name: string;
  description: string;
  present: boolean;
  evidence?: string;
}

// FEATURE 1: SCAM DNA TYPES
export type ScamDnaCategory = 
  | 'ARTIFICIAL_URGENCY'
  | 'FEAR_EXPLOITATION'
  | 'AUTHORITY_IMPERSONATION'
  | 'GREED_REWARD'
  | 'CURIOSITY_EXPLOITATION'
  | 'SOCIAL_PRESSURE'
  | 'EMOTIONAL_MANIPULATION'
  | 'CREDENTIAL_HARVESTING';

export interface ScamDnaTechnique {
  id: ScamDnaCategory;
  name: string;
  detected: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  supportingEvidence?: string;
  simpleExplanation: string;
  psychologicalMechanism: string;
}

export interface ScamDnaProfile {
  detectedCount: number;
  totalEvaluated: number;
  primaryTechnique?: string;
  techniques: ScamDnaTechnique[];
  manipulationIntensity: 'LOW' | 'MODERATE' | 'SEVERE';
}

// FEATURE 2: TRUST INTELLIGENCE REPORT TYPES
export interface TechnicalIndicator {
  name: string;
  status: 'CLEAR' | 'SUSPICIOUS' | 'CRITICAL';
  details: string;
  evidence?: string;
}

export interface IdentityAssessment {
  claimedEntity?: string;
  channelVerified: boolean;
  verificationSource: string; // "NO_VERIFIED_SOURCE" or official domain/entity
  impersonationLikelihood: 'LOW' | 'SUSPICIOUS' | 'CRITICAL';
  warningSigns: string[];
}

export interface DistinguishedFinding {
  observedEvidence: string[]; // Verbatim facts extracted directly from text
  possibleWarningSigns: string[]; // Algorithmic heuristic alarms
  aiInterpretation: string; // LLM contextual analysis
}

export interface TrustIntelligenceReport {
  overallRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  technicalIndicators: TechnicalIndicator[];
  psychologicalSummary: ScamDnaProfile;
  identityAssessment: IdentityAssessment;
  distinguishedFindings: DistinguishedFinding;
  recommendedProtectiveActions: {
    immediate: string[];
    secondary: string[];
    reportingChannels: string[];
  };
}

// FEATURE 5: FAMILY GUARD SUMMARY
export interface FamilyGuardSummary {
  safetyRating: 'SAFE' | 'CAUTION' | 'DANGER';
  headline: string;
  friendlyExplanation: string;
  whatYouShouldDo: string[];
  whatYouMustNeverDo: string[];
  shareableSummaryText: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  inputExcerpt: string;
  fullMessage?: string;
  sourceType: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'OTHER';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  summary: string;
  explanation: string;
  detectedIndicators: DetectedIndicator[];
  extractedUrls: UrlFinding[];
  manipulationTactics: ManipulationTactic[];
  recommendations: string[];
  isAiEnhanced: boolean;
  aiModelUsed?: string;
  languageDetected?: string;
  // Differentiating Additions:
  scamDna?: ScamDnaProfile;
  trustReport?: TrustIntelligenceReport;
  familyGuard?: FamilyGuardSummary;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  excerpt: string;
  fullMessage?: string;
  riskLevel: RiskLevel;
  riskScore: number;
  indicatorsCount: number;
  urlsCount: number;
  summary: string;
  recommendations: string[];
  languageDetected?: string;
}

export interface SystemStats {
  totalScans: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  urlsAnalyzed: number;
  threatRate: number; // percentage
}

// FEATURE 3: SCAM SIMULATOR TYPES
export interface SimulatorQuestion {
  id: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  scenarioTitle: string;
  senderProfile: string;
  messageText: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  suspiciousIndicators: string[];
  safeFictionalContext: string;
  points: number;
}

// FEATURE 4: REGIONAL INTELLIGENCE TYPES
export interface RegionalThreatCase {
  id: string;
  region: 'Assam & North-East' | 'Eastern India (Bengal/Bihar)' | 'Pan-India National';
  language: RegionalLanguage;
  threatTitle: string;
  targetDemographic: string;
  modusOperandi: string;
  deceptivePhrases: {
    originalText: string;
    transliterationOrTranslation: string;
    scamIntent: string;
  }[];
  officialAdvisorySource: string; // e.g. "CID Assam Cyber Cell / RBI Kehta Hai / PIB Fact Check"
  verifiedRemedies: string[];
}
