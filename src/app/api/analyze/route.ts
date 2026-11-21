import { NextRequest, NextResponse } from 'next/server';
import { runDeterministicDetection } from '@/lib/detector';
import { explainWithGemini } from '@/lib/gemini';
import { AnalysisResult, RiskLevel } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload received.' },
        { status: 400 }
      );
    }

    const rawMessage = body?.message;
    const sourceType = body?.sourceType || 'SMS';
    const targetLanguage = body?.targetLanguage;

    if (!rawMessage || typeof rawMessage !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid text message to scan.' },
        { status: 400 }
      );
    }

    const trimmedMessage = rawMessage.trim();
    if (trimmedMessage.length < 3) {
      return NextResponse.json(
        { error: 'Message is too short to analyze. Please enter at least 3 characters.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { error: 'Message exceeds maximum limit of 5,000 characters.' },
        { status: 413 }
      );
    }

    // 1. Run deterministic heuristic detection engine
    const deterministic = runDeterministicDetection(trimmedMessage);

    // 2. Call Gemini for explainable AI breakdown if key is present
    const geminiResult = await explainWithGemini({
      message: trimmedMessage,
      deterministicScore: deterministic.score,
      deterministicRiskLevel: deterministic.riskLevel,
      indicators: deterministic.detectedIndicators,
      urls: deterministic.extractedUrls,
      manipulationTactics: deterministic.manipulationTactics,
      languageDetected: deterministic.languageDetected,
      targetLanguage,
    });

    const isAiEnhanced = geminiResult.success && !!geminiResult.data;

    // 3. Assemble structured analysis result
    // Maintain deterministic score as the primary authoritative numeric value
    const finalResult: AnalysisResult = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      inputExcerpt: trimmedMessage.slice(0, 140) + (trimmedMessage.length > 140 ? '...' : ''),
      fullMessage: trimmedMessage,
      sourceType: ['SMS', 'WHATSAPP', 'EMAIL', 'OTHER'].includes(sourceType) ? sourceType : 'OTHER',
      riskScore: deterministic.score,
      riskLevel: deterministic.riskLevel,
      confidence: deterministic.detectedIndicators.length > 2 ? 'HIGH' : deterministic.detectedIndicators.length > 0 ? 'MEDIUM' : 'LOW',
      summary: isAiEnhanced ? geminiResult.data!.summary : deterministic.summary,
      explanation: isAiEnhanced ? geminiResult.data!.explanation : deterministic.explanation,
      detectedIndicators: deterministic.detectedIndicators,
      extractedUrls: deterministic.extractedUrls,
      manipulationTactics: deterministic.manipulationTactics,
      recommendations: isAiEnhanced ? geminiResult.data!.recommendations : deterministic.recommendations,
      isAiEnhanced,
      aiModelUsed: isAiEnhanced ? geminiResult.modelUsed : undefined,
      languageDetected: deterministic.languageDetected,
      scamDna: deterministic.scamDna,
      trustReport: deterministic.trustReport,
      familyGuard: deterministic.familyGuard,
    };

    return NextResponse.json(finalResult, { status: 200 });
  } catch (error) {
    console.error('ScamShield API analysis error:', error);
    return NextResponse.json(
      {
        error: 'An internal error occurred during message analysis. Please try again.',
      },
      { status: 500 }
    );
  }
}
