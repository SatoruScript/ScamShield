import { 
  TrustIntelligenceReport, 
  TechnicalIndicator, 
  IdentityAssessment, 
  DistinguishedFinding, 
  RiskLevel,
  UrlFinding,
  DetectedIndicator
} from './types';
import { analyzeScamDna } from './scamDna';

const OFFICIAL_BRANDS: { [key: string]: { name: string; domains: string[]; verifiedSmsHeaders: string[] } } = {
  'sbi': {
    name: 'State Bank of India',
    domains: ['onlinesbi.sbi', 'sbi.co.in', 'statebankofindia.com'],
    verifiedSmsHeaders: ['SBIINB', 'SBIPAY', 'SBISMS', 'ATMSBI']
  },
  'hdfc': {
    name: 'HDFC Bank',
    domains: ['hdfcbank.com'],
    verifiedSmsHeaders: ['HDFCBK', 'HDFCAL']
  },
  'icici': {
    name: 'ICICI Bank',
    domains: ['icicibank.com'],
    verifiedSmsHeaders: ['ICICIB', 'ICICI']
  },
  'indiapost': {
    name: 'India Post (Department of Posts)',
    domains: ['indiapost.gov.in', 'cept.gov.in'],
    verifiedSmsHeaders: ['INDPOST', 'IPOSTS']
  },
  'rbi': {
    name: 'Reserve Bank of India',
    domains: ['rbi.org.in'],
    verifiedSmsHeaders: ['RBIINF']
  },
  'electricity': {
    name: 'State Electricity Distribution Co.',
    domains: ['apdcl.org', 'wbsedcl.in', 'bsesdelhi.com', 'tnebnet.org'],
    verifiedSmsHeaders: ['APDCL', 'WBSEDCL']
  }
};

export function generateTrustReport(
  messageText: string,
  detectedIndicators: DetectedIndicator[],
  extractedUrls: UrlFinding[],
  overallRiskScore: number,
  riskLevel: RiskLevel,
  aiExplanation?: string
): TrustIntelligenceReport {
  const trimmed = messageText.trim();
  const lower = trimmed.toLowerCase();

  // 1. Technical Indicators Extraction
  const technicalIndicators: TechnicalIndicator[] = [];

  if (extractedUrls.length === 0) {
    technicalIndicators.push({
      name: 'Embedded Hyperlinks',
      status: 'CLEAR',
      details: 'No web addresses or redirect links were found in the message body.',
    });
  } else {
    for (const url of extractedUrls) {
      if (url.protocol === 'http:' && !url.isHttps) {
        technicalIndicators.push({
          name: 'Unencrypted Protocol (HTTP)',
          status: 'CRITICAL',
          details: 'Transmits unencrypted plaintext over standard HTTP without SSL/TLS encryption.',
          evidence: url.url,
        });
      } else if (url.isHttps) {
        technicalIndicators.push({
          name: 'Transport Layer Security (HTTPS)',
          status: 'SUSPICIOUS',
          details: 'Uses HTTPS encryption. Note: Modern phishing sites frequently use free automated SSL certificates (Let’s Encrypt/Cloudflare) to appear legitimate.',
          evidence: url.url,
        });
      }

      if (url.isIpAddress) {
        technicalIndicators.push({
          name: 'Raw IP Address Hostname',
          status: 'CRITICAL',
          details: 'Direct numeric IP host bypasses DNS registration to evade domain reputation filters.',
          evidence: url.hostname,
        });
      }

      if (url.isShortener) {
        technicalIndicators.push({
          name: 'URL Obfuscation / Shortener Service',
          status: 'CRITICAL',
          details: 'Hides the true landing destination behind an intermediary redirect service.',
          evidence: url.hostname,
        });
      }

      if (url.isSuspiciousTld) {
        technicalIndicators.push({
          name: 'High-Abuse Generic Top-Level Domain',
          status: 'SUSPICIOUS',
          details: 'Utilizes a low-cost, disposable TLD frequently exploited in automated credential campaigns.',
          evidence: url.hostname,
        });
      }

      if (url.hasDeceptiveSubdomain) {
        technicalIndicators.push({
          name: 'Subdomain Brand Squatting',
          status: 'CRITICAL',
          details: 'Places an institution name in a prefix subdomain while actual ownership rests with a distinct root domain.',
          evidence: url.hostname,
        });
      }
    }
  }

  // 2. Psychological Indicators (Scam DNA)
  const psychologicalSummary = analyzeScamDna(trimmed);

  // 3. Identity and Impersonation Assessment
  let claimedBrandKey: string | undefined = undefined;
  for (const key of Object.keys(OFFICIAL_BRANDS)) {
    if (lower.includes(key) || lower.includes(OFFICIAL_BRANDS[key].name.toLowerCase())) {
      claimedBrandKey = key;
      break;
    }
  }

  const identityWarningSigns: string[] = [];
  let impersonationLikelihood: 'LOW' | 'SUSPICIOUS' | 'CRITICAL' = 'LOW';
  let verificationSource = 'NO_VERIFIED_SOURCE — Sender identity cannot be corroborated cryptographically or via verified domain.';
  let claimedEntity: string | undefined = undefined;

  if (claimedBrandKey) {
    const brand = OFFICIAL_BRANDS[claimedBrandKey];
    claimedEntity = brand.name;

    // Check if the URL matches the legitimate brand domains
    const hasOfficialDomain = extractedUrls.some(u => 
      brand.domains.some(validDomain => u.hostname === validDomain || u.hostname.endsWith(`.${validDomain}`))
    );

    if (!hasOfficialDomain && extractedUrls.length > 0) {
      impersonationLikelihood = 'CRITICAL';
      identityWarningSigns.push(`Claims to originate from ${brand.name}, but links to an unassociated web host (${extractedUrls.map(u => u.hostname).join(', ')}).`);
      identityWarningSigns.push(`Official ${brand.name} operations are strictly hosted on verified domains: ${brand.domains.join(', ')}.`);
    } else if (extractedUrls.length === 0) {
      impersonationLikelihood = 'SUSPICIOUS';
      identityWarningSigns.push(`Message references ${brand.name} without verifiable cryptographic delivery provenance.`);
    }
  }

  // Check phone numbers / generic contact methods
  const phoneMatch = lower.match(/(?:call|contact|whatsapp|helpline|mo[b:]?)\s*(?:at\s*)?([+0-9\s-]{10,13})/i);
  if (phoneMatch) {
    identityWarningSigns.push(`Directs communication to a non-toll-free private phone contact: ${phoneMatch[1].trim()}`);
    if (impersonationLikelihood === 'LOW') impersonationLikelihood = 'SUSPICIOUS';
  }

  const identityAssessment: IdentityAssessment = {
    claimedEntity,
    channelVerified: false, // Never mark verified without verifiable cryptographic source
    verificationSource,
    impersonationLikelihood,
    warningSigns: identityWarningSigns,
  };

  // 4. Clearly Distinguish Evidence vs Warnings vs AI Interpretation
  const observedEvidence: string[] = [];
  const possibleWarningSigns: string[] = [];

  // Verbatim quotes / extracted items
  if (extractedUrls.length > 0) {
    observedEvidence.push(`Extracted Web Link: ${extractedUrls.map(u => u.url).join(' | ')}`);
  }
  for (const technique of psychologicalSummary.techniques) {
    if (technique.detected && technique.supportingEvidence) {
      observedEvidence.push(`Exact text snippet: ${technique.supportingEvidence}`);
      possibleWarningSigns.push(`${technique.name}: ${technique.simpleExplanation}`);
    }
  }
  for (const ind of detectedIndicators) {
    if (!possibleWarningSigns.some(w => w.includes(ind.title))) {
      possibleWarningSigns.push(`${ind.title}: ${ind.description}`);
    }
  }

  if (observedEvidence.length === 0) {
    observedEvidence.push('No direct malicious tokens, phishing links, or high-risk keywords detected in the raw input.');
  }

  const distinguishedFindings: DistinguishedFinding = {
    observedEvidence,
    possibleWarningSigns,
    aiInterpretation: aiExplanation || 'Deterministic security heuristics and pattern classifiers indicate the structural properties of this message.',
  };

  // 5. Recommended Protective Playbook
  const immediateActions: string[] = [];
  const secondaryActions: string[] = [];
  const reportingChannels: string[] = [
    'National Cyber Crime Reporting Portal: https://cybercrime.gov.in',
    'National Cyber Helpline (Toll-Free 24x7): 1930',
    'DoT Chakshu Portal (Suspected Fraudulent Communication): https://sancharsaathi.gov.in/sfc/',
  ];

  if (riskLevel === 'HIGH') {
    immediateActions.push('DO NOT click any links, download attachments, or call numbers listed in the message.');
    immediateActions.push('DO NOT disclose OTPs, UPI PINs, passwords, or personal identity documents under any circumstance.');
    immediateActions.push('If you already entered bank credentials or an OTP, contact your bank immediately to freeze your account/cards.');
    secondaryActions.push('Take a screenshot of the message including the sender address/phone number for evidentiary records.');
    secondaryActions.push('Block and report the sender number or WhatsApp contact as spam.');
  } else if (riskLevel === 'MEDIUM') {
    immediateActions.push('Exercise caution. Do not click links or share details directly through this notification.');
    immediateActions.push('Verify the request independently by typing the official company URL directly into your browser.');
    secondaryActions.push('Compare the sender ID with previous legitimate communications received from that service.');
  } else {
    immediateActions.push('Maintain general cyber hygiene: never disclose passwords or security credentials over SMS or messaging apps.');
    secondaryActions.push('If unsure, cross-check against official service announcements.');
  }

  return {
    overallRiskScore,
    riskLevel,
    technicalIndicators,
    psychologicalSummary,
    identityAssessment,
    distinguishedFindings,
    recommendedProtectiveActions: {
      immediate: immediateActions,
      secondary: secondaryActions,
      reportingChannels,
    },
  };
}
