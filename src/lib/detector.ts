import { AnalysisResult, DetectedIndicator, ManipulationTactic, RiskLevel, UrlFinding, ScamDnaProfile, TrustIntelligenceReport, FamilyGuardSummary } from './types';
import { analyzeScamDna } from './scamDna';
import { generateTrustReport } from './trustIntelligence';
import { generateFamilyGuardSummary } from './familyGuard';

// Regular expressions to extract URLs safely without opening or fetching them
const URL_REGEX = /https?:\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/gi;
const IP_HOST_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::\d+)?$/;

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 't.co', 'ow.ly', 'rebrand.ly',
  'buff.ly', 'shorte.st', 'rb.gy', 'v.gd', 'bc.vc', 'qr.ae', 'snip.ly',
  'clck.ru', 'rotf.lol', 'goo.gl', 'bl.ink'
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'buzz', 'cc', 'cf', 'gq', 'ml', 'tk', 'live', 'click',
  'club', 'work', 'loan', 'racing', 'win', 'date', 'download', 'stream',
  'surf', 'link', 'icu', 'cam', 'quest', 'vip'
]);

const TRUSTED_INSTITUTION_DOMAINS: { [brand: string]: string[] } = {
  'sbi': ['onlinesbi.sbi', 'sbi.co.in', 'statebankofindia.com'],
  'hdfc': ['hdfcbank.com'],
  'icici': ['icicibank.com'],
  'axis': ['axisbank.com'],
  'pnb': ['pnbindia.in'],
  'rbi': ['rbi.org.in'],
  'indiapost': ['indiapost.gov.in'],
  'fedex': ['fedex.com'],
  'dhl': ['dhl.com'],
  'amazon': ['amazon.in', 'amazon.com'],
  'netflix': ['netflix.com'],
  'google': ['google.com'],
  'microsoft': ['microsoft.com'],
  'apple': ['apple.com'],
};

export interface DetectorRule {
  id: string;
  category: DetectedIndicator['category'];
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  points: number;
  test: (text: string, lower: string) => { match: boolean; evidence?: string };
}

export const DETECTOR_RULES: DetectorRule[] = [
  // 1. Critical Credential / OTP Theft
  {
    id: 'req_otp_pin',
    category: 'CREDENTIALS',
    title: 'Credential or OTP Solicitation',
    description: 'The message actively asks for an OTP, UPI PIN, CVV, password, or security code. Legitimate institutions strictly never solicit verification codes.',
    severity: 'HIGH',
    points: 40,
    test: (_, lower) => {
      const isProtectiveWarning = /(never share|do not share|don't share|not to be shared|keep it confidential)/i.test(lower);
      
      const solicitationMatch = lower.match(/\b(share (your |the )?(otp|pin|password|code|cvv)|send (your |the )?(otp|pin)|enter your (pin|password|cvv|upi pin)|tell (the )?otp|forward this (otp|code))\b/);
      if (solicitationMatch) {
        return { match: true, evidence: `Solicitation: "${solicitationMatch[0]}"` };
      }

      if (!isProtectiveWarning && /\b(otp|cvv|upi pin|atm pin|mpin)\b/.test(lower) && /\b(share|send|submit|provide|call|contact|bhejo|batao|diya)\b/.test(lower)) {
        const trigger = lower.match(/\b(share|send|submit|provide|call|contact|bhejo|batao)\b.*\b(otp|pin|code)\b/)?.[0] || 'OTP/PIN solicitation';
        return { match: true, evidence: trigger };
      }

      const regionalMatch = lower.match(/\b(otp bhejo|pin batao|otp pathao|pin diyak)\b/);
      if (regionalMatch) {
        return { match: true, evidence: `Regional credential solicitation: "${regionalMatch[0]}"` };
      }

      return { match: false };
    }
  },

  // 2. Urgent Account Suspension / Threats
  {
    id: 'urg_account_suspension',
    category: 'URGENCY',
    title: 'Urgent Account Suspension Threat',
    description: 'Imposes severe artificial pressure by threatening that your bank account, SIM card, or service will be blocked or closed immediately.',
    severity: 'HIGH',
    points: 30,
    test: (_, lower) => {
      const match = lower.match(/\b(suspended today|blocked today|deactivated today|account closure|stopped today|will be blocked|will be suspended|within 24 hours|within 2 hours|immediately to avoid|immediate action required|service terminated)\b/);
      if (match) {
        return { match: true, evidence: `Threat phrasing: "${match[0]}"` };
      }
      const regionalMatch = lower.match(/(khata band|khata block|aajiye bondho hobo|sim bandh|bijli kaat|line koti jabo)/);
      if (regionalMatch) {
        return { match: true, evidence: `Regional threat trigger: "${regionalMatch[0]}"` };
      }
      return { match: false };
    }
  },

  // 3. KYC Verification Traps
  {
    id: 'fake_kyc_mandate',
    category: 'IMPERSONATION',
    title: 'Forced KYC / Document Verification Mandate',
    description: 'Prompts immediate PAN card, Aadhaar, or KYC verification through an unverified external channel or link.',
    severity: 'HIGH',
    points: 30,
    test: (_, lower) => {
      const match = lower.match(/\b(kyc (update|verification|expired|pending|mandate|suspended|status)|verify (your )?kyc|update (your )?(kyc|pan|aadhaar)|link (aadhaar|pan)|re-kyc|kyc update)\b/);
      if (match) {
        return { match: true, evidence: `KYC pattern: "${match[0]}"` };
      }
      return { match: false };
    }
  },

  // 4. Fake Pending Transaction / Unauthorized Debit Bait
  {
    id: 'fake_unauthorized_debit',
    category: 'FINANCIAL',
    title: 'Fake Unauthorized Transaction / Pending Debit Scare',
    description: 'Falsely claims an unauthorized debit or transaction is pending, inducing panic to prompt contact or credential disclosure.',
    severity: 'HIGH',
    points: 30,
    test: (_, lower) => {
      const match = lower.match(/\b((debit of|transaction of|payment of) (rs\.?|inr|\$) ?[0-9,]+ (is pending|was attempted|failed|unauthorized)|to stop this transaction|cancel this payment)\b/);
      if (match) {
        return { match: true, evidence: `Debit scare trigger: "${match[0]}"` };
      }
      return { match: false };
    }
  },

  // 5. Utility / Electricity Disconnection Scams
  {
    id: 'utility_power_cutoff',
    category: 'FEAR_TACTIC',
    title: 'Utility or Electricity Disconnection Scam',
    description: 'Claims your electricity or utility will be disconnected tonight due to a fake pending bill, directing you to call a personal mobile number.',
    severity: 'HIGH',
    points: 30,
    test: (_, lower) => {
      const match = lower.match(/\b(electricity (bill|power|office|disconnection)|power will be disconnected|light bill unpaid|bijli bill|power cut)\b/);
      if (match) {
        return { match: true, evidence: `Utility threat: "${match[0]}"` };
      }
      return { match: false };
    }
  },

  // 6. Lottery, Cash Prize & Too-Good-To-Be-True Offers
  {
    id: 'unsolicited_lottery_prize',
    category: 'UNSOLICITED_OFFER',
    title: 'Unsolicited Lottery or Cash Prize',
    description: 'Claims you have won a massive cash reward, KBC lottery, lucky draw, or car without entering any competition.',
    severity: 'HIGH',
    points: 30,
    test: (_, lower) => {
      const match = lower.match(/\b(won (a lottery|cash prize|lucky draw|\$|rs|inr|crore|lakh)|kbc (lucky draw|winner)|congratulations! you (have )?won|reward points expiring|claim your free gift)\b/);
      if (match) {
        return { match: true, evidence: `Prize bait: "${match[0]}"` };
      }
      return { match: false };
    }
  },

  // 7. Work-From-Home / Part-Time Job / Telegram Scam
  {
    id: 'fake_job_telegram',
    category: 'FINANCIAL',
    title: 'Part-Time Job / Task Investment Bait',
    description: 'Offers unrealistically high daily pay (e.g. Rs 5000/day for liking videos or hotel ratings) directing users to private Telegram channels.',
    severity: 'MEDIUM',
    points: 25,
    test: (_, lower) => {
      const match = lower.match(/\b(work from home|part[- ]time job|earn (daily|per day)|like youtube videos|google review task|telegram channel|daily income guaranteed)\b/);
      if (match) {
        return { match: true, evidence: `Job scam bait: "${match[0]}"` };
      }
      return { match: false };
    }
  },

  // 8. Courier / Parcel / India Post Delivery Trap
  {
    id: 'fake_delivery_parcel',
    category: 'IMPERSONATION',
    title: 'Fake Courier or Delivery Failure Notice',
    description: 'Falsely claims an undelivered parcel or incomplete address from India Post, DHL, or FedEx, demanding immediate address update or small fee.',
    severity: 'MEDIUM',
    points: 25,
    test: (_, lower) => {
      const match = lower.match(/\b(package (stuck|delayed|held|suspended|cannot be delivered)|invalid address|update delivery address|india post package|customs clearance fee|parcel cannot be delivered)\b/);
      if (match) {
        return { match: true, evidence: `Delivery lure: "${match[0]}"` };
      }
      return { match: false };
    }
  },

  // 9. Brand Impersonation Signals in Unsolicited Context
  {
    id: 'brand_impersonation',
    category: 'IMPERSONATION',
    title: 'Brand or Authority Impersonation',
    description: 'Mentions prominent financial institutions, telecom carriers, or government agencies within a suspicious informal message.',
    severity: 'MEDIUM',
    points: 15,
    test: (_, lower) => {
      const hasSuspiciousContext = /(suspended|kyc|verify|click|link|http|urgent|immediately|won|prize|bill|blocked|call [0-9])/i.test(lower);
      if (!hasSuspiciousContext) return { match: false };

      const match = lower.match(/\b(state bank of india|sbi|hdfc|icici|axis bank|punjab national bank|pnb|reserve bank|rbi|income tax dept|cyber crime cell|trai|jio|airtel)\b/);
      if (match) {
        return { match: true, evidence: `Claimed entity: "${match[0].toUpperCase()}"` };
      }
      return { match: false };
    }
  },

  // 10. Coercive Secrecy or "Digital Arrest" Pressure
  {
    id: 'coercive_pressure',
    category: 'FEAR_TACTIC',
    title: 'Coercive Secrecy or Immediate Threat',
    description: 'Instructs the user not to inform anyone, threats of arrest, police FIR, or legal action.',
    severity: 'HIGH',
    points: 35,
    test: (_, lower) => {
      const match = lower.match(/\b(police fir|arrest warrant|legal action|court notice|cbi officer|narcotics dept|digital arrest|do not disconnect the call|do not inform family)\b/);
      if (match) {
        return { match: true, evidence: `Coercive phrase: "${match[0]}"` };
      }
      return { match: false };
    }
  }
];

export function extractAndAnalyzeUrls(text: string): UrlFinding[] {
  const matches = text.match(URL_REGEX) || [];
  const uniqueUrls = Array.from(new Set(matches));

  return uniqueUrls.map(rawUrl => {
    let normalized = rawUrl.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }

    const flags: string[] = [];
    let riskScore = 0;
    let hostname = '';
    let protocol = 'https:';

    try {
      const parsed = new URL(normalized);
      hostname = parsed.hostname.toLowerCase();
      protocol = parsed.protocol;
    } catch {
      hostname = rawUrl;
    }

    const isHttps = protocol === 'https:';
    if (!isHttps) {
      flags.push('Unencrypted HTTP protocol (Data submitted can be intercepted)');
      riskScore += 20;
    }

    const isIpAddress = IP_HOST_REGEX.test(hostname);
    if (isIpAddress) {
      flags.push('Uses raw numerical IP address instead of registered domain name');
      riskScore += 35;
    }

    const isShortener = KNOWN_SHORTENERS.has(hostname) || Array.from(KNOWN_SHORTENERS).some(s => hostname.endsWith('.' + s));
    if (isShortener) {
      flags.push('URL shortener obscures true destination host');
      riskScore += 25;
    }

    const parts = hostname.split('.');
    const tld = parts.length > 1 ? parts[parts.length - 1] : '';
    const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
    if (isSuspiciousTld) {
      flags.push(`Uses high-risk, low-reputation top-level domain (.${tld}) frequently used in disposable phishing campaigns`);
      riskScore += 25;
    }

    const hasExcessiveSubdomains = parts.length >= 4;
    if (hasExcessiveSubdomains) {
      flags.push('Unusual number of subdomain levels (often disguises malicious root domain)');
      riskScore += 15;
    }

    let hasDeceptiveSubdomain = false;
    for (const [brand, officialDomains] of Object.entries(TRUSTED_INSTITUTION_DOMAINS)) {
      if (hostname.includes(brand)) {
        const isOfficial = officialDomains.some(official => hostname === official || hostname.endsWith('.' + official));
        if (!isOfficial) {
          hasDeceptiveSubdomain = true;
          flags.push(`Deceptive impersonation: Contains brand name "${brand.toUpperCase()}" but domain is not an official ${brand.toUpperCase()} property`);
          riskScore += 40;
          break;
        }
      }
    }

    const hasSuspiciousKeywords = /(kyc|update|verify|login|secure|banking|account|otp|pan|free|gift|reward)/i.test(normalized);
    if (hasSuspiciousKeywords && !flags.some(f => f.includes('Deceptive impersonation'))) {
      flags.push('Contains credential/banking keywords in unverified link structure');
      riskScore += 15;
    }

    return {
      url: rawUrl,
      hostname,
      protocol,
      isHttps,
      isIpAddress,
      isShortener,
      isSuspiciousTld,
      hasDeceptiveSubdomain,
      hasSuspiciousKeywords,
      hasExcessiveSubdomains,
      riskScore: Math.min(100, riskScore),
      flags,
    };
  });
}

export function detectManipulationTactics(text: string, lower: string): ManipulationTactic[] {
  const tactics: ManipulationTactic[] = [
    {
      name: 'Artificial Urgency & Countdown Pressure',
      description: 'Manufactures an urgent deadline (e.g. "today", "within 24 hours") to force victims to react before having time to verify.',
      present: /(today|immediately|within 24 hours|urgent|within 2 hours|hurry|now|last chance)/i.test(lower),
      evidence: lower.match(/\b(today|immediately|within 24 hours|urgent|within 2 hours|hurry|now|last chance)\b/)?.[0]
    },
    {
      name: 'Fear of Negative Consequences',
      description: 'Exploits fear by threatening account suspension, electric blackout, police arrest, or heavy fines.',
      present: /(suspended|blocked|closure|arrest|fir|legal action|penalty|fine|disconnected|deactivated)/i.test(lower),
      evidence: lower.match(/\b(suspended|blocked|closure|arrest|fir|legal action|penalty|fine|disconnected|deactivated)\b/)?.[0]
    },
    {
      name: 'Authority & Institutional Impersonation',
      description: 'Impersonates banks, government bodies, police, or postal services to borrow credibility.',
      present: /(bank|sbi|hdfc|rbi|income tax|police|customs|india post|officer|manager|dept)/i.test(lower),
      evidence: lower.match(/\b(bank|sbi|hdfc|rbi|income tax|police|customs|india post|officer|manager|dept)\b/)?.[0]
    },
    {
      name: 'Greed / Unexpected Financial Gain',
      description: 'Baits the user with cash prizes, lottery payouts, or unrealistically high-paying work-from-home tasks.',
      present: /(won|lottery|prize|reward points|cashback|earn daily|5000|lakh|crore|free gift)/i.test(lower),
      evidence: lower.match(/\b(won|lottery|prize|reward points|cashback|earn daily|5000|lakh|crore|free gift)\b/)?.[0]
    },
    {
      name: 'Friction Bypass (Redirecting to Links/Personal Numbers)',
      description: 'Steers the victim away from official customer portals toward private links, personal mobile numbers, or unverified apps.',
      present: /(click here|link below|visit|download apk|call [0-9]{10}|whatsapp)/i.test(lower),
      evidence: lower.match(/\b(click here|link below|visit|download apk|call [0-9]{10}|whatsapp)\b/)?.[0]
    }
  ];

  return tactics;
}

export function detectLanguage(text: string): string {
  if (/[\u0900-\u097F]/.test(text)) {
    return 'Hindi (Devanagari script)';
  }
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'Assamese / Bengali script';
  }
  if (/(aajiye|bondho|hobo|liyok|pathao|kori|tatkhalik)/i.test(text)) {
    return 'Assamese (Romanized transliteration)';
  }
  if (/(khata|bijli|kat|bhejo|paisa|karo|batao|jayegi)/i.test(text)) {
    return 'Hindi (Romanized transliteration)';
  }
  return 'English';
}

export function runDeterministicDetection(text: string): {
  score: number;
  riskLevel: RiskLevel;
  detectedIndicators: DetectedIndicator[];
  extractedUrls: UrlFinding[];
  manipulationTactics: ManipulationTactic[];
  recommendations: string[];
  summary: string;
  explanation: string;
  languageDetected: string;
  scamDna: ScamDnaProfile;
  trustReport: TrustIntelligenceReport;
  familyGuard: FamilyGuardSummary;
} {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const detectedIndicators: DetectedIndicator[] = [];
  let rawScore = 0;

  const hasProtectiveWarning = /(never share your (otp|password)|do not share this (otp|code)|valid for [0-9]+ mins)/i.test(lower);
  const hasDeceptiveLinks = extractAndAnalyzeUrls(trimmed).some(u => u.riskScore >= 20);

  // Run all detector rules
  for (const rule of DETECTOR_RULES) {
    const result = rule.test(trimmed, lower);
    if (result.match) {
      if (hasProtectiveWarning && !hasDeceptiveLinks && (rule.id === 'brand_impersonation' || rule.id === 'req_otp_pin')) {
        continue;
      }

      detectedIndicators.push({
        id: rule.id,
        category: rule.category,
        title: rule.title,
        description: rule.description,
        severity: rule.severity,
        evidence: result.evidence,
        points: rule.points,
      });
      rawScore += rule.points;
    }
  }

  // URL analysis
  const extractedUrls = extractAndAnalyzeUrls(trimmed);
  for (const urlFinding of extractedUrls) {
    if (urlFinding.riskScore > 0) {
      const severity: 'LOW' | 'MEDIUM' | 'HIGH' = urlFinding.riskScore >= 40 ? 'HIGH' : urlFinding.riskScore >= 20 ? 'MEDIUM' : 'LOW';
      detectedIndicators.push({
        id: `url_${urlFinding.hostname}`,
        category: 'SUSPICIOUS_LINK',
        title: `Suspicious Web Address: ${urlFinding.hostname}`,
        description: urlFinding.flags.join('; ') || 'Identified potential risk factors in URL format.',
        severity,
        evidence: urlFinding.url,
        points: Math.min(35, Math.round(urlFinding.riskScore * 0.4)),
      });
      rawScore += Math.min(35, Math.round(urlFinding.riskScore * 0.4));
    }
  }

  // Bound score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, rawScore));

  // Determine risk level based on the prompt's suggested scoring:
  // Low: 0–29, Medium: 30–59, High: 60–100
  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 60) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 30) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  const manipulationTactics = detectManipulationTactics(trimmed, lower);

  const recommendations: string[] = [];
  if (detectedIndicators.some(i => i.category === 'CREDENTIALS')) {
    recommendations.push('NEVER disclose your OTP, PIN, CVV, or passwords to anyone. Banks and official service providers will never request verification codes.');
  }
  if (extractedUrls.length > 0) {
    recommendations.push('Do NOT click the links in this message. If you need to access your account, open a browser and type the bank or service provider’s verified official URL manually.');
  }
  if (detectedIndicators.some(i => i.category === 'URGENCY' || i.category === 'FEAR_TACTIC')) {
    recommendations.push('Pause and take a breath. Scammers manufacture urgent deadlines ("within 24 hours", "suspended today") to trigger panic. Real banks provide written postal notices and legitimate dispute periods.');
  }
  if (detectedIndicators.some(i => i.category === 'UNSOLICITED_OFFER' || i.category === 'FINANCIAL')) {
    recommendations.push('Be cautious of unsolicited prizes or work-from-home tasks. Legitimate organizations do not distribute lotteries to people who never entered.');
  }
  if (detectedIndicators.some(i => i.category === 'IMPERSONATION')) {
    recommendations.push('Verify the communication directly through verified customer support numbers listed on the back of your physical bank card or official portal.');
  }
  if (recommendations.length === 0) {
    recommendations.push('This message appears low risk, but maintain standard cyber vigilance: never enter passwords or sensitive information on unverified forms.');
  }

  let summary = '';
  let explanation = '';

  if (riskLevel === 'HIGH') {
    summary = `High risk detected (${finalScore}/100). Compounding warning signs indicate a probable phishing or impersonation scam.`;
    explanation = `Our deterministic security engine flagged ${detectedIndicators.length} serious risk indicators. The message employs classic social engineering manipulation—combining artificial urgency with high-stakes threats (such as account suspension or service termination) to induce panic and prompt action via unverified links or credential requests.`;
  } else if (riskLevel === 'MEDIUM') {
    summary = `Moderate risk detected (${finalScore}/100). The message exhibits suspicious patterns that warrant extreme caution.`;
    explanation = `Our security engine flagged ${detectedIndicators.length} cautionary signals. While it may not contain all hallmarks of an active attack, the combination of unverified links, vague organizational claims, or promotional pressure suggests this message should be treated with skepticism. Do not click links or share details without independent verification.`;
  } else {
    summary = `Low risk assessed (${finalScore}/100). No significant high-threat scam patterns or deceptive links were detected.`;
    explanation = `The message does not trigger typical phishing, credential harvesting, or extortion heuristics. It appears consistent with standard notification formatting. However, always exercise baseline caution and never disclose security credentials.`;
  }

  const languageDetected = detectLanguage(trimmed);
  const scamDna = analyzeScamDna(trimmed);
  const trustReport = generateTrustReport(trimmed, detectedIndicators, extractedUrls, finalScore, riskLevel, explanation);
  const familyGuard = generateFamilyGuardSummary(trimmed, riskLevel, finalScore, scamDna);

  return {
    score: finalScore,
    riskLevel,
    detectedIndicators,
    extractedUrls,
    manipulationTactics,
    recommendations,
    summary,
    explanation,
    languageDetected,
    scamDna,
    trustReport,
    familyGuard,
  };
}
