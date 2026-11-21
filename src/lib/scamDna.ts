import { ScamDnaCategory, ScamDnaProfile, ScamDnaTechnique } from './types';

interface TechniqueDefinition {
  id: ScamDnaCategory;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  simpleExplanation: string;
  psychologicalMechanism: string;
  extractEvidence: (text: string, lower: string) => string | null;
}

const TECHNIQUE_DEFINITIONS: TechniqueDefinition[] = [
  // 1. Artificial Urgency
  {
    id: 'ARTIFICIAL_URGENCY',
    name: 'Artificial Urgency',
    severity: 'HIGH',
    simpleExplanation: 'Creates a fake ticking clock to induce panic before you have time to consult anyone or verify facts.',
    psychologicalMechanism: 'Imposes extreme time scarcity to overload working memory and trigger hasty, impulsive decision-making.',
    extractEvidence: (text, lower) => {
      // English patterns
      const enMatch = lower.match(/\b(within 24 hours|within 2 hours|within 1 hour|within 30 mins|immediately to avoid|immediately|today only|today itself|expires in \d+ (minutes|hours)|urgent action required|action needed immediately|before midnight|last reminder|immediate effect)\b/);
      if (enMatch) return `Urgency trigger: "${enMatch[0]}"`;

      // Hindi / Transliterated
      const hiMatch = lower.match(/\b(aaj hi|turant|24 ghante ke andar|jald se jald|aaj raat 12 baje se pehle|akhiri chetavani|antim avsar)\b/);
      if (hiMatch) return `Urgency trigger (Hindi): "${hiMatch[0]}"`;

      // Assamese
      const asMatch = text.match(/(আজিৰ ভিতৰত|আজি শেষ|তৎক্ষণাৎ|২৪ ঘণ্টাৰ ভিতৰত|অতি শীঘ্ৰে|পলম নকৰিব)/);
      if (asMatch) return `Urgency trigger (Assamese): "${asMatch[0]}"`;
      const asTrans = lower.match(/\b(aajiye|aaji bondho|turantei|ati xighre|polom nokoribo)\b/);
      if (asTrans) return `Urgency trigger (Assamese transliterated): "${asTrans[0]}"`;

      // Bengali
      const bnMatch = text.match(/(আজকের মধ্যে|২৪ ঘণ্টার মধ্যে|অবিলম্বে|দেরি না করে|শেষ সুযোগ|জরুরি নোটিশ)/);
      if (bnMatch) return `Urgency trigger (Bengali): "${bnMatch[0]}"`;
      const bnTrans = lower.match(/\b(ajker moddhe|24 ghontar moddhe|obilonbe|taholei bondho)\b/);
      if (bnTrans) return `Urgency trigger (Bengali transliterated): "${bnTrans[0]}"`;

      return null;
    }
  },

  // 2. Fear Exploitation
  {
    id: 'FEAR_EXPLOITATION',
    name: 'Fear & Threat Exploitation',
    severity: 'HIGH',
    simpleExplanation: 'Threatens severe punitive consequences—such as frozen funds, police arrest, or power shutoff—to intimidate you into compliance.',
    psychologicalMechanism: 'Triggers the amygdala fight-or-flight response, overriding critical scrutiny through fear of loss or prosecution.',
    extractEvidence: (text, lower) => {
      // English patterns
      const enMatch = lower.match(/\b(account suspended|account blocked|service terminated|power will be disconnected|electricity disconnected|electricity will be cut|legal action will be taken|police case|non-bailable warrant|arrest warrant|court summons|penalized|penalty of rs|sim deactivated|line disconnected)\b/);
      if (enMatch) return `Fear exploit: "${enMatch[0]}"`;

      // Hindi / Transliterated
      const hiMatch = lower.match(/\b(khata band|khata block|bijli kaat di jayegi|bijli disconnection|police karwahi|kanuni karwai|giraftari|sim band|jurmana)\b/);
      if (hiMatch) return `Fear exploit (Hindi): "${hiMatch[0]}"`;

      // Assamese
      const asMatch = text.match(/(একাউণ্ট বন্ধ|লাইন কাটি দিয়া|আইনী ব্যৱস্থা|বিদ্যুৎ সংযোগ বিচ্ছিন্ন|গ্ৰেপ্তাৰী ৱাৰেণ্ট|জৰিমনা)/);
      if (asMatch) return `Fear exploit (Assamese): "${asMatch[0]}"`;
      const asTrans = lower.match(/\b(account bondho|line koti jabo|bijli katibo|police aahibo|arrest koribo)\b/);
      if (asTrans) return `Fear exploit (Assamese transliterated): "${asTrans[0]}"`;

      // Bengali
      const bnMatch = text.match(/(একাউন্ট ব্লক|বিদ্যুৎ সংযোগ বিচ্ছিন্ন|আইনি ব্যবস্থা|গ্রেপ্তার|জরিমানা|লাইন কেটে দেওয়া)/);
      if (bnMatch) return `Fear exploit (Bengali): "${bnMatch[0]}"`;
      const bnTrans = lower.match(/\b(account bondho|line kete deoa hobe|police arrest|mamla hobe)\b/);
      if (bnTrans) return `Fear exploit (Bengali transliterated): "${bnTrans[0]}"`;

      return null;
    }
  },

  // 3. Authority Impersonation
  {
    id: 'AUTHORITY_IMPERSONATION',
    name: 'Authority Impersonation',
    severity: 'HIGH',
    simpleExplanation: 'Presents itself as a bank, courier, telecom, or government authority to extract blind obedience.',
    psychologicalMechanism: 'Leverages the Milgram obedience bias, where individuals are conditioned to comply with established institutions.',
    extractEvidence: (text, lower) => {
      // Look for institutional claims
      const instMatch = lower.match(/\b(state bank of india|sbi|hdfc|icici|axis bank|punjab national bank|pnb|reserve bank of india|rbi|trai|income tax department|cyber crime cell|cbi|customs department|india post|electricity board|apdcl|wbsedcl|mha|police department)\b/);
      if (instMatch) {
        return `Impersonation signature: "${instMatch[0].toUpperCase()}"`;
      }

      // Check for generic official titles
      const roleMatch = lower.match(/\b(official notice|department of telecommunications|cyber crime officer|nodal officer|head office mandate|government subsidy)\b/);
      if (roleMatch) return `Official persona claim: "${roleMatch[0]}"`;

      // Regional claims
      if (text.includes('ভাৰতীয় ডাক') || text.includes('বিদ্যুৎ বিভাগ') || text.includes('আৰক্ষী')) {
        return 'Assamese official entity impersonation (ডাক / বিদ্যুৎ / আৰক্ষী)';
      }
      if (text.includes('ডাক বিভাগ') || text.includes('বিদ্যুৎ পর্ষদ') || text.includes('পুলিশ')) {
        return 'Bengali official entity impersonation (ডাক / বিদ্যুৎ / পুলিশ)';
      }

      return null;
    }
  },

  // 4. Greed and Reward Manipulation
  {
    id: 'GREED_REWARD',
    name: 'Greed & Reward Manipulation',
    severity: 'HIGH',
    simpleExplanation: 'Dangles effortless cash, prizes, or part-time earnings to lure you into lowering your normal guard.',
    psychologicalMechanism: 'Activates dopamine pathways related to reward anticipation, suppressing rational skepticism regarding realistic returns.',
    extractEvidence: (text, lower) => {
      // English
      const enMatch = lower.match(/\b(won a lucky prize|cashback of rs|won rs|daily income rs|earn rs \d+|part-time job rs|youtube like and earn|telegram task job|pre-approved loan of rs|congratulations you won|lottery winner|bonus credited|instant approval 0% interest)\b/);
      if (enMatch) return `Reward lure: "${enMatch[0]}"`;

      // Hindi
      const hiMatch = lower.match(/\b(inaam jita|lottery lag gayi|rozana kamaye|ghar baithe kamaye|cashback mila|muft upahar|bina byaj loan)\b/);
      if (hiMatch) return `Reward lure (Hindi): "${hiMatch[0]}"`;

      // Assamese
      const asMatch = text.match(/(পুৰস্কাৰ লাভ|লটাৰী জিকিছে|দৈনিক উপাৰ্জন|বিনামূলীয়া উপহাৰ|ঘৰতে বহি উপাৰ্জন)/);
      if (asMatch) return `Reward lure (Assamese): "${asMatch[0]}"`;

      // Bengali
      const bnMatch = text.match(/(পুরস্কার জিতেছেন|লটারি জিতেছেন|প্রতিদিন আয়|ঘরে বসে ইনকাম|বিনামূল্যে উপহার)/);
      if (bnMatch) return `Reward lure (Bengali): "${bnMatch[0]}"`;

      return null;
    }
  },

  // 5. Curiosity Exploitation
  {
    id: 'CURIOSITY_EXPLOITATION',
    name: 'Curiosity Exploitation',
    severity: 'MEDIUM',
    simpleExplanation: 'Withholds complete details or teases intriguing secrets to compel you into clicking a link.',
    psychologicalMechanism: 'Exploits Loewenstein’s Information Gap Theory—the psychological discomfort of not knowing drives an irresistible urge to resolve the unknown.',
    extractEvidence: (_, lower) => {
      const match = lower.match(/\b(parcel address incomplete|delivery failed update address|see who viewed your profile|check confidential document|view unread message|photos of you uploaded|someone mentioned you|unclaimed courier waiting)\b/);
      if (match) return `Curiosity hook: "${match[0]}"`;

      const regMatch = lower.match(/\b(parcel atki gayi|delivery baki hai|parcel aahise kintu pata nai|chobi upload hoise)\b/);
      if (regMatch) return `Curiosity hook (regional): "${regMatch[0]}"`;

      return null;
    }
  },

  // 6. Social Pressure & Isolation
  {
    id: 'SOCIAL_PRESSURE',
    name: 'Social Pressure & Enforced Secrecy',
    severity: 'HIGH',
    simpleExplanation: 'Commands you to keep the matter strictly secret or stay on the line, isolating you from friends or bank staff who would warn you.',
    psychologicalMechanism: 'Social isolation prevents external peer verification and collective reality-testing, making the victim dependent on the scammer’s narrative.',
    extractEvidence: (text, lower) => {
      const match = lower.match(/\b(do not disclose to anyone|keep strictly confidential|do not disconnect the call|do not inform family|stay on the call|exclusive invitation|confidential investigation|do not share with bank staff)\b/);
      if (match) return `Enforced secrecy: "${match[0]}"`;

      const regMatch = lower.match(/\b(kisi ko mat batana|call cut mat karna|kaoke bolben na|kaouke janaben na|kio keu najanibo|gopon rakhibo)\b/);
      if (regMatch) return `Enforced secrecy (regional): "${regMatch[0]}"`;

      return null;
    }
  },

  // 7. Emotional Manipulation
  {
    id: 'EMOTIONAL_MANIPULATION',
    name: 'Emotional & Empathy Manipulation',
    severity: 'HIGH',
    simpleExplanation: 'Fabricates an emotional tragedy, hospital emergency, or arrested loved one to trigger knee-jerk panic and financial rescue.',
    psychologicalMechanism: 'Hijacks deep-seated familial empathy and protective instincts, making logical verification feel unfeeling or disrespectful.',
    extractEvidence: (text, lower) => {
      const match = lower.match(/\b(hospital emergency|urgent medical help|met with an accident|in police custody please help|save my life|friend in distress|send money urgently for treatment)\b/);
      if (match) return `Emotional hook: "${match[0]}"`;

      const regMatch = lower.match(/\b(hospital me bharti|accident ho gaya|police ne pakad liya|chikitsha kharash|bipod e porechi)\b/);
      if (regMatch) return `Emotional hook (regional): "${regMatch[0]}"`;

      return null;
    }
  },

  // 8. Credential Harvesting Attempts
  {
    id: 'CREDENTIAL_HARVESTING',
    name: 'Direct Credential Harvesting',
    severity: 'HIGH',
    simpleExplanation: 'Explicitly solicits private secrets (OTP, UPI PIN, CVV, passwords) which give the attacker direct control over your money or accounts.',
    psychologicalMechanism: 'Constructs a pretext where surrendering security codes feels necessary for verification, breaking the cryptographic barrier.',
    extractEvidence: (text, lower) => {
      // Protective warnings must not be counted as harvesting attempts!
      if (/(never share|do not share|don't share|not to be shared|keep confidential|satark)/i.test(lower)) {
        return null;
      }

      const match = lower.match(/\b(share (your )?(otp|pin|password|cvv)|enter (your )?(upi pin|atm pin|mpin|cvv)|send otp|verify (your )?pan|link aadhaar|submit credentials|type your password)\b/);
      if (match) return `Harvesting pattern: "${match[0]}"`;

      const regMatch = lower.match(/\b(otp bhejo|pin batao|otp pathao|pin diyak|password pathan)\b/);
      if (regMatch) return `Harvesting pattern (regional): "${regMatch[0]}"`;

      return null;
    }
  }
];

/**
 * Analyzes the psychological manipulation tactics present in a message.
 * Strict rule: Does not identify a technique without supporting evidence.
 */
export function analyzeScamDna(messageText: string): ScamDnaProfile {
  if (!messageText || messageText.trim().length === 0) {
    return {
      detectedCount: 0,
      totalEvaluated: TECHNIQUE_DEFINITIONS.length,
      techniques: TECHNIQUE_DEFINITIONS.map(t => ({
        id: t.id,
        name: t.name,
        detected: false,
        severity: t.severity,
        simpleExplanation: t.simpleExplanation,
        psychologicalMechanism: t.psychologicalMechanism,
      })),
      manipulationIntensity: 'LOW',
    };
  }

  const trimmed = messageText.trim();
  const lower = trimmed.toLowerCase();

  const evaluatedTechniques: ScamDnaTechnique[] = TECHNIQUE_DEFINITIONS.map(t => {
    const evidence = t.extractEvidence(trimmed, lower);
    const isDetected = Boolean(evidence);

    return {
      id: t.id,
      name: t.name,
      detected: isDetected,
      severity: t.severity,
      supportingEvidence: evidence || undefined,
      simpleExplanation: t.simpleExplanation,
      psychologicalMechanism: t.psychologicalMechanism,
    };
  });

  const detectedOnly = evaluatedTechniques.filter(t => t.detected);
  const detectedCount = detectedOnly.length;

  let intensity: 'LOW' | 'MODERATE' | 'SEVERE' = 'LOW';
  if (detectedCount >= 3 || detectedOnly.some(t => t.id === 'CREDENTIAL_HARVESTING' || t.id === 'FEAR_EXPLOITATION')) {
    intensity = 'SEVERE';
  } else if (detectedCount >= 1) {
    intensity = 'MODERATE';
  }

  const primaryTechnique = detectedOnly.length > 0 ? detectedOnly[0].name : undefined;

  return {
    detectedCount,
    totalEvaluated: TECHNIQUE_DEFINITIONS.length,
    primaryTechnique,
    techniques: evaluatedTechniques,
    manipulationIntensity: intensity,
  };
}
