import { AnalysisResult, RiskLevel, ScanHistoryItem, SystemStats } from './types';

const HISTORY_STORAGE_KEY = 'scamshield_scan_history_v1';
const PRIVACY_SETTINGS_KEY = 'scamshield_privacy_settings_v1';

export interface PrivacySettings {
  storeFullMessage: boolean;
}

export function getPrivacySettings(): PrivacySettings {
  if (typeof window === 'undefined') {
    return { storeFullMessage: false };
  }
  try {
    const raw = localStorage.getItem(PRIVACY_SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read privacy settings:', e);
  }
  return { storeFullMessage: false }; // Privacy-first default: do not store full private message
}

export function savePrivacySettings(settings: PrivacySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save privacy settings:', e);
  }
}

export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch (e) {
    console.error('Failed to read scan history:', e);
    return [];
  }
}

export function saveScanToHistory(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getScanHistory();
    const settings = getPrivacySettings();

    const historyItem: ScanHistoryItem = {
      id: result.id,
      timestamp: result.timestamp,
      excerpt: result.inputExcerpt,
      fullMessage: settings.storeFullMessage ? result.fullMessage : undefined,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      indicatorsCount: result.detectedIndicators.length,
      urlsCount: result.extractedUrls.length,
      summary: result.summary,
      recommendations: result.recommendations,
    };

    // Keep up to 100 recent scans locally
    const updated = [historyItem, ...current.filter(i => i.id !== result.id)].slice(0, 100);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save scan to history:', e);
  }
}

export function deleteScanHistoryItem(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getScanHistory();
    const updated = current.filter(i => i.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete scan item:', e);
  }
}

export function clearAllScanHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear scan history:', e);
  }
}

export function calculateStatsFromHistory(history: ScanHistoryItem[]): SystemStats {
  const totalScans = history.length;
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let urlsAnalyzed = 0;

  for (const item of history) {
    if (item.riskLevel === 'HIGH') highRiskCount++;
    else if (item.riskLevel === 'MEDIUM') mediumRiskCount++;
    else lowRiskCount++;

    urlsAnalyzed += item.urlsCount || 0;
  }

  const threatRate = totalScans > 0 ? Math.round(((highRiskCount + mediumRiskCount) / totalScans) * 100) : 0;

  return {
    totalScans,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    urlsAnalyzed,
    threatRate,
  };
}
