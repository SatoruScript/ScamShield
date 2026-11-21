import { GoogleGenAI } from '@google/genai';
import { DetectedIndicator, ManipulationTactic, RegionalLanguage, RiskLevel, UrlFinding } from './types';

export interface GeminiAnalysisPayload {
  message: string;
  deterministicScore: number;
  deterministicRiskLevel: RiskLevel;
  indicators: DetectedIndicator[];
  urls: UrlFinding[];
  manipulationTactics: ManipulationTactic[];
  languageDetected: string;
  targetLanguage?: RegionalLanguage;
}

export interface GeminiAnalysisResponse {
  summary: string;
  explanation: string;
  riskAssessmentReasoning: string;
  psychologicalTricksIdentified: string[];
  recommendations: string[];
  suggestedActionLabel: string;
  distinguishedEvidenceNotes?: string;
}

export async function explainWithGemini(
  payload: GeminiAnalysisPayload
): Promise<{
  success: boolean;
  data?: GeminiAnalysisResponse;
  modelUsed?: string;
  error?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      success: false,
      error: 'GEMINI_API_KEY is not configured on server. Used heuristic deterministic engine.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const targetLang = payload.targetLanguage || 'English';

    const systemPrompt = `You are ScamShield AI, an expert cybersecurity and anti-fraud analyst explaining digital threats to everyday citizens in India.
Your job is to provide an explainable, transparent, and educational breakdown of a suspicious message (SMS, WhatsApp, email) based on detected technical and psychological indicators.

CRITICAL RULES:
1. Do not invent or override the security score. The deterministic heuristic engine has already calculated a score of ${payload.deterministicScore}/100 with risk level ${payload.deterministicRiskLevel}.
2. Your task is EXPLAINABILITY: Explain in clear, empathetic, non-technical language WHY these patterns are dangerous, which psychological tricks the sender is using, and exactly what the user should do right now.
3. LANGUAGE DIRECTIVE: Output the summary, explanation, and recommendations in ${targetLang}. If the requested language is Assamese (অসমীয়া), Hindi (हिन्दी), or Bengali (বাংলা), provide fluent, natural, grammatically correct sentences in that script alongside standard technical terms in brackets.
4. Never claim that an identity or sender has been verified without an actual verification source.
5. Clearly distinguish observed evidence from hypothetical risks or AI interpretation.
6. Return ONLY a valid JSON object matching the requested schema. No markdown formatting outside the JSON, no backticks enclosing other text.

JSON Schema to return:
{
  "summary": "1-2 sentence executive summary of the finding in simple terms (in ${targetLang})",
  "explanation": "Clear 3-4 sentence explanation of the detected red flags, psychological manipulation, and deceptive mechanics (in ${targetLang})",
  "riskAssessmentReasoning": "Why this specific risk level was assigned based on the indicators",
  "psychologicalTricksIdentified": ["List of 2-4 social engineering or psychological tactics used, e.g. 'False Urgency (Countdown to Account Freeze)', 'Authority Borrowing (Pretending to be SBI Bank)'"],
  "recommendations": ["3-5 clear, bulleted action steps for the user, starting with actionable verbs (in ${targetLang})"],
  "suggestedActionLabel": "Short button label recommendation (e.g. 'Do Not Click & Report Spam')",
  "distinguishedEvidenceNotes": "Brief 1-sentence note separating confirmed text facts from heuristic assumptions"
}`;

    const userContent = `Analyze this message:
"""
${payload.message.slice(0, 2000)}
"""

Detected Deterministic Indicators:
${payload.indicators.map(i => `- [${i.severity}] ${i.title}: ${i.description} (Evidence: ${i.evidence || 'N/A'})`).join('\n') || 'None detected'}

Extracted Links:
${payload.urls.map(u => `- ${u.url} (Score: ${u.riskScore}, Flags: ${u.flags.join(', ') || 'None'})`).join('\n') || 'None'}

Detected Language Context: ${payload.languageDetected}
Requested Target Language: ${targetLang}
Pre-assessed Heuristic Risk: ${payload.deterministicRiskLevel} (${payload.deterministicScore}/100)

Provide your structured explainable cybersecurity breakdown:`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userContent}` }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleanedJson) as GeminiAnalysisResponse;

    if (!parsed.summary || !parsed.explanation || !Array.isArray(parsed.recommendations)) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return {
      success: true,
      data: parsed,
      modelUsed: modelName,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown Gemini error';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
