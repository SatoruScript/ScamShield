import { FamilyGuardSummary, RiskLevel, ScamDnaProfile } from './types';

export function generateFamilyGuardSummary(
  messageText: string,
  riskLevel: RiskLevel,
  riskScore: number,
  scamDna?: ScamDnaProfile
): FamilyGuardSummary {
  let safetyRating: 'SAFE' | 'CAUTION' | 'DANGER' = 'SAFE';
  let headline = 'This message looks safe, but stay alert';
  let friendlyExplanation = 'We did not find any typical tricks or fake threats in this message. However, always remember that banks and government offices will never ask you for your passwords or secret codes.';
  const whatYouShouldDo: string[] = [];
  const whatYouMustNeverDo: string[] = [];

  const detectedUrgency = scamDna?.techniques.find(t => t.id === 'ARTIFICIAL_URGENCY' && t.detected);
  const detectedFear = scamDna?.techniques.find(t => t.id === 'FEAR_EXPLOITATION' && t.detected);
  const detectedAuth = scamDna?.techniques.find(t => t.id === 'AUTHORITY_IMPERSONATION' && t.detected);
  const detectedReward = scamDna?.techniques.find(t => t.id === 'GREED_REWARD' && t.detected);
  const detectedCreds = scamDna?.techniques.find(t => t.id === 'CREDENTIAL_HARVESTING' && t.detected);

  if (riskLevel === 'HIGH' || riskScore >= 60) {
    safetyRating = 'DANGER';
    headline = '⚠️ DO NOT REPLY — High Chance of a Scam';
    
    if (detectedCreds) {
      friendlyExplanation = 'Someone is trying to steal your bank password, OTP, or UPI PIN. If you give this to them, they can take money out of your bank account immediately.';
    } else if (detectedFear) {
      friendlyExplanation = 'This message is trying to scare you by claiming your bank account, electricity, or phone line will be stopped. Real companies do not cut off your service through a sudden SMS with a random link.';
    } else if (detectedReward) {
      friendlyExplanation = 'This message claims you won free money, lottery cash, or a high-paying job. This is a classic trap to get you to send them money first or steal your details.';
    } else {
      friendlyExplanation = 'This message is using pressure tactics and fake links to trick you. Do not open any links or call any phone numbers listed in it.';
    }

    whatYouShouldDo.push('Delete or ignore the message right away.');
    whatYouShouldDo.push('Show this message to a tech-savvy family member or call someone you trust.');
    whatYouShouldDo.push('If it claims to be from your bank or electricity board, only visit their official physical branch or use their official app.');

    whatYouMustNeverDo.push('NEVER share any 4-digit or 6-digit OTP code sent to your phone.');
    whatYouMustNeverDo.push('NEVER click on any links in this message.');
    whatYouMustNeverDo.push('NEVER send money or enter your UPI PIN to "receive" money.');
  } else if (riskLevel === 'MEDIUM' || riskScore >= 30) {
    safetyRating = 'CAUTION';
    headline = '⚠️ BE CAREFUL — Something Seems Fishy';
    friendlyExplanation = 'This message has some unusual details or strange links. Even if it sounds urgent or looks like it is from a real company, do not act quickly without checking first.';

    whatYouShouldDo.push('Pause and take a breath. Scammers want you to rush.');
    whatYouShouldDo.push('Ask a family member or friend to look at it with you.');
    whatYouShouldDo.push('Call customer care using the number written on the back of your bank card, not from the message.');

    whatYouMustNeverDo.push('Do NOT click unknown links sent by numbers you do not recognize.');
    whatYouMustNeverDo.push('Do NOT share Aadhaar, PAN card, or bank details on web forms sent via SMS.');
  } else {
    safetyRating = 'SAFE';
    whatYouShouldDo.push('If this is a normal service update (like a delivery notification or bank transaction alert), you can proceed normally.');
    whatYouShouldDo.push('Keep in mind: real delivery agents or banks will never ask you to install any app or pay to update your address.');

    whatYouMustNeverDo.push('Never forward sensitive bank SMS to unknown strangers.');
  }

  // Generate shareable WhatsApp card text
  const excerpt = messageText.length > 70 ? `${messageText.slice(0, 67)}...` : messageText;
  const ratingEmoji = safetyRating === 'DANGER' ? '🚨 HIGH RISK SCAM ALERT' : safetyRating === 'CAUTION' ? '⚠️ SUSPICIOUS MESSAGE ALERT' : '✅ LOW RISK MESSAGE';
  
  const shareableSummaryText = 
`🛡️ *ScamShield Safety Advisory*
━━━━━━━━━━━━━━━━━━━━
${ratingEmoji}

📝 *Message Received:*
"${excerpt}"

🔍 *Summary:*
${friendlyExplanation}

🛑 *Important Rules:*
${whatYouMustNeverDo.map(item => `• ${item}`).join('\n')}

💡 *Recommended Action:*
${whatYouShouldDo.map(item => `• ${item}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━
_Verified with ScamShield AI Threat Detector_`;

  return {
    safetyRating,
    headline,
    friendlyExplanation,
    whatYouShouldDo,
    whatYouMustNeverDo,
    shareableSummaryText,
  };
}
