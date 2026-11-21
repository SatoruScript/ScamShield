export interface DetailedUrlAnalysis {
  rawUrl: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  tld: string;
  domainName: string;
  subdomains: string[];
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  indicators: {
    id: string;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    passed: boolean;
  }[];
  explanation: string;
  recommendations: string[];
}

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

const TYPOSQUAT_TARGETS = [
  { brand: 'State Bank of India', key: 'sbi', official: ['onlinesbi.sbi', 'sbi.co.in'] },
  { brand: 'HDFC Bank', key: 'hdfc', official: ['hdfcbank.com'] },
  { brand: 'ICICI Bank', key: 'icici', official: ['icicibank.com'] },
  { brand: 'Axis Bank', key: 'axis', official: ['axisbank.com'] },
  { brand: 'Punjab National Bank', key: 'pnb', official: ['pnbindia.in'] },
  { brand: 'India Post', key: 'indiapost', official: ['indiapost.gov.in'] },
  { brand: 'Amazon', key: 'amazon', official: ['amazon.in', 'amazon.com'] },
  { brand: 'Netflix', key: 'netflix', official: ['netflix.com'] },
  { brand: 'Google', key: 'google', official: ['google.com'] },
  { brand: 'PayPal', key: 'paypal', official: ['paypal.com'] },
];

export function analyzeUrlSafety(rawInput: string): DetailedUrlAnalysis {
  let normalized = rawInput.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  let protocol = 'https:';
  let hostname = '';
  let port = '';
  let pathname = '/';
  let search = '';
  let isValidUrl = true;

  try {
    const parsed = new URL(normalized);
    protocol = parsed.protocol;
    hostname = parsed.hostname.toLowerCase();
    port = parsed.port;
    pathname = parsed.pathname;
    search = parsed.search;
  } catch {
    isValidUrl = false;
    hostname = rawInput.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
  }

  const parts = hostname.split('.');
  const tld = parts.length > 1 ? parts[parts.length - 1] : '';
  const domainName = parts.length >= 2 ? `${parts[parts.length - 2]}.${tld}` : hostname;
  const subdomains = parts.length > 2 ? parts.slice(0, parts.length - 2) : [];

  const indicators: DetailedUrlAnalysis['indicators'] = [];
  let score = 0;

  // 1. Protocol Check (HTTP vs HTTPS)
  const isHttps = protocol === 'https:';
  if (!isHttps) {
    indicators.push({
      id: 'no_https',
      title: 'Unencrypted HTTP Connection',
      description: 'The link uses plaintext HTTP. Any passwords, card details, or personal data entered can be intercepted in transit.',
      severity: 'HIGH',
      passed: false,
    });
    score += 30;
  } else {
    indicators.push({
      id: 'https_present',
      title: 'HTTPS Encryption Present',
      description: 'The link utilizes SSL/TLS transport encryption. (Note: HTTPS encrypts data in transit but does not guarantee the destination is honest; scammers can easily issue free SSL certificates).',
      severity: 'LOW',
      passed: true,
    });
  }

  // 2. IP Address Hostname
  const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
  if (isIp) {
    indicators.push({
      id: 'ip_hostname',
      title: 'Raw Numerical IP Address Used as Hostname',
      description: 'Legitimate institutions almost never send links with raw IP addresses instead of registered domain names. This is a common evasion technique.',
      severity: 'HIGH',
      passed: false,
    });
    score += 40;
  } else {
    indicators.push({
      id: 'named_domain',
      title: 'Standard Named Hostname',
      description: 'Hostname resolves to a named DNS registration rather than a bare IP address.',
      severity: 'LOW',
      passed: true,
    });
  }

  // 3. URL Shortener Inspection
  const isShortener = KNOWN_SHORTENERS.has(hostname) || Array.from(KNOWN_SHORTENERS).some(s => hostname.endsWith('.' + s));
  if (isShortener) {
    indicators.push({
      id: 'url_shortener',
      title: 'URL Shortening Service Detected',
      description: 'The URL uses a redirect service (e.g., bit.ly, tinyurl) that conceals the true landing domain and destination server.',
      severity: 'MEDIUM',
      passed: false,
    });
    score += 25;
  } else {
    indicators.push({
      id: 'transparent_url',
      title: 'Direct Unshortened Link',
      description: 'The domain destination is visible directly without intermediate link concealment.',
      severity: 'LOW',
      passed: true,
    });
  }

  // 4. Risky / Suspicious TLD
  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  if (isSuspiciousTld) {
    indicators.push({
      id: 'suspicious_tld',
      title: `High-Risk Top-Level Domain (.${tld})`,
      description: `The domain uses an extension (.${tld}) frequently leveraged by malicious actors due to cheap registration costs and lax identity verification.`,
      severity: 'HIGH',
      passed: false,
    });
    score += 25;
  }

  // 5. Lookalike & Brand Impersonation in Subdomains
  let impersonationFound = false;
  for (const target of TYPOSQUAT_TARGETS) {
    if (hostname.includes(target.key)) {
      const isAuthorized = target.official.some(off => hostname === off || hostname.endsWith('.' + off));
      if (!isAuthorized) {
        impersonationFound = true;
        indicators.push({
          id: `impersonation_${target.key}`,
          title: `Brand Mimicry: "${target.brand}"`,
          description: `The hostname embeds the brand name "${target.key.toUpperCase()}" (e.g. "${hostname}"), but is NOT registered on the verified domain (${target.official.join(' or ')}). This is a deceptive subdomain or lookalike trick.`,
          severity: 'HIGH',
          passed: false,
        });
        score += 45;
        break;
      }
    }
  }

  // 6. Excessive Subdomains
  if (subdomains.length >= 2) {
    indicators.push({
      id: 'excessive_subdomains',
      title: 'Multi-Level Subdomain Structure',
      description: `Detected ${subdomains.length} subdomain tiers (${subdomains.join('.')}). Attackers frequently prepend trusted-looking words (like "login.verify.sbi") in front of an unrelated attacker-controlled root domain.`,
      severity: 'MEDIUM',
      passed: false,
    });
    score += 20;
  }

  // 7. Obfuscated / Encoded Characters or Port Redirection
  const hasSuspiciousPort = port && port !== '80' && port !== '443';
  if (hasSuspiciousPort) {
    indicators.push({
      id: 'non_standard_port',
      title: `Non-Standard Web Port (Port :${port})`,
      description: `The web connection specifies port :${port} instead of standard web traffic ports (80/443). Often seen in rogue and ad-hoc phishing hosts.`,
      severity: 'HIGH',
      passed: false,
    });
    score += 30;
  }

  // 8. Suspicious Keywords in Path or Parameters
  if (/(kyc|pan-card|aadhaar|verify-account|login-now|update-bank|claim-reward|apk)/i.test(normalized)) {
    indicators.push({
      id: 'phishing_keywords_path',
      title: 'Phishing Pattern Keywords in Path',
      description: 'The URL path or query string contains sensitive credential triggers (e.g. kyc, verify, login, apk) on an unverified domain.',
      severity: 'MEDIUM',
      passed: false,
    });
    score += 20;
  }

  const boundedScore = Math.min(100, Math.max(0, score));
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (boundedScore >= 60) riskLevel = 'HIGH';
  else if (boundedScore >= 30) riskLevel = 'MEDIUM';

  const recommendations: string[] = [];
  if (riskLevel === 'HIGH') {
    recommendations.push('DO NOT OPEN this link on your device. It shows prominent signs of malicious phishing or malware distribution.');
    recommendations.push('If you need to access this service, search for the official brand on Google or type their verified domain directly into your address bar.');
    recommendations.push('Never download APK files or enter login/banking credentials from external links sent in SMS or messaging apps.');
  } else if (riskLevel === 'MEDIUM') {
    recommendations.push('Exercise caution. Expand shortened URLs with an unshortener tool before browsing.');
    recommendations.push('Check the root domain carefully to ensure you are not visiting a lookalike clone.');
  } else {
    recommendations.push('The URL format exhibits standard, low-risk characteristics.');
    recommendations.push('Remember that even secure (HTTPS) websites can host deceptive forms; verify the brand identity before sharing sensitive personal data.');
  }

  const failedCount = indicators.filter(i => !i.passed).length;
  const explanation = riskLevel === 'HIGH'
    ? `Critical warning: ${failedCount} security red flags were detected on this address. The link demonstrates hallmarks of brand impersonation or domain deception designed to steal personal or banking data.`
    : riskLevel === 'MEDIUM'
    ? `Caution advised: ${failedCount} risk indicators were noted (such as URL shortening or non-standard structure). Confirm the destination before proceeding.`
    : `The URL does not exhibit typical deceptive domain structures, IP hostnames, or brand mimicry. Standard cyber vigilance is still recommended.`;

  return {
    rawUrl: rawInput,
    normalizedUrl: normalized,
    protocol,
    hostname,
    port,
    pathname,
    search,
    tld,
    domainName,
    subdomains,
    riskScore: boundedScore,
    riskLevel,
    indicators,
    explanation,
    recommendations,
  };
}
