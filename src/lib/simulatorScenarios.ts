import { SimulatorQuestion } from './types';

export const SIMULATOR_SCENARIOS: SimulatorQuestion[] = [
  // BEGINNER LEVEL
  {
    id: 'sim_beg_01',
    difficulty: 'BEGINNER',
    category: 'Courier & Package Impersonation',
    scenarioTitle: 'The "Failed Delivery" Package Notification',
    senderProfile: 'SMS from: +91-98765-XXXXX (Unknown Private Mobile)',
    messageText: 'Your courier parcel #IN-98231 cannot be delivered due to incomplete street address. Please update your details within 24 hours at http://indiapost-update.xyz/track or your package will be returned to sender.',
    question: 'What is the most immediate giveaway that this message is a scam?',
    options: [
      {
        id: 'opt_1a',
        text: 'The tracking number has only 5 digits.',
        isCorrect: false,
        explanation: 'Tracking numbers vary in length across services; the format alone is not the primary technical indicator of fraud.'
      },
      {
        id: 'opt_1b',
        text: 'It was sent from a personal mobile number and uses an unencrypted HTTP link on a suspicious ".xyz" domain.',
        isCorrect: true,
        explanation: 'Correct! Official couriers and India Post use registered alphabetical sender IDs (e.g. INDPOST) and official ".gov.in" domains, never private personal SIMs or cheap ".xyz" TLDs.'
      },
      {
        id: 'opt_1c',
        text: 'Couriers never return packages to sender.',
        isCorrect: false,
        explanation: 'Couriers do return undeliverable parcels, but legitimate ones leave calling cards or formal status updates on their official app.'
      },
      {
        id: 'opt_1d',
        text: 'The message is written in English.',
        isCorrect: false,
        explanation: 'Most courier tracking messages are written in English or bilingual formats.'
      }
    ],
    suspiciousIndicators: [
      'Sent from an anonymous 10-digit mobile number instead of an official SMS header',
      'Uses unencrypted http:// rather than HTTPS',
      'Suspicious generic TLD (.xyz) masquerading as India Post',
      'Artificial 24-hour urgency deadline to induce panic'
    ],
    safeFictionalContext: 'Fictional exercise based on common courier address phishing lures.',
    points: 100
  },
  {
    id: 'sim_beg_02',
    difficulty: 'BEGINNER',
    category: 'Utility & Bill Extortion',
    scenarioTitle: 'The "Immediate Electricity Power Disconnection" Threat',
    senderProfile: 'SMS from: +91-76543-XXXXX',
    messageText: 'Dear Consumer, Your electricity bill for the previous month was not updated. Your power supply will be disconnected tonight at 9:30 PM. Immediately contact Electricity Officer Mr. Sharma at 98110XXXXX.',
    question: 'How should you respond if you receive an alert like this on your phone?',
    options: [
      {
        id: 'opt_2a',
        text: 'Call the mobile number immediately to explain you already paid.',
        isCorrect: false,
        explanation: 'Calling the scammer connects you to a high-pressure con artist trained to intimidate you into transferring money or downloading remote access tools.'
      },
      {
        id: 'opt_2b',
        text: 'Check your electricity bill status directly through your official utility app or monthly paper bill, and ignore the SMS.',
        isCorrect: true,
        explanation: 'Spot on! Electricity boards (APDCL, WBSEDCL, BESCOM, etc.) never assign individual staff personal mobile numbers for disconnection threats. Always verify on official consumer portals.'
      },
      {
        id: 'opt_2c',
        text: 'Pay ₹10 to the officer on Google Pay to keep the line active.',
        isCorrect: false,
        explanation: 'This is the exact trap. Even a small initial payment compromises your UPI handle and opens you up to financial exploitation.'
      },
      {
        id: 'opt_2d',
        text: 'Forward the message to your neighbors to warn them.',
        isCorrect: false,
        explanation: 'Forwarding unverified threat messages spreads panic and scam phone numbers to other vulnerable victims.'
      }
    ],
    suspiciousIndicators: [
      'Extortion deadline set for "tonight at 9:30 PM"',
      'Directs victim to call a personal 10-digit mobile number',
      'Absence of consumer ID (CA number / Consumer Number)',
      'Utility providers follow strict legal notice periods before disconnection'
    ],
    safeFictionalContext: 'Fictional simulation of standard electricity disconnection social engineering.',
    points: 100
  },

  // INTERMEDIATE LEVEL
  {
    id: 'sim_int_01',
    difficulty: 'INTERMEDIATE',
    category: 'Banking & Lookalike Domains',
    scenarioTitle: 'The "Urgent KYC Verification" Link',
    senderProfile: 'SMS Header: VK-SBIBNK',
    messageText: 'SBI Alert: Dear customer, your YONO banking account will be suspended today due to expired KYC documentation. Please verify your PAN immediately to continue transactions: https://onlinesbi.co.portal-kyc.in/login',
    question: 'Examining the web link, why is this an impersonation attack even though the header says "VK-SBIBNK"?',
    options: [
      {
        id: 'opt_3a',
        text: 'Banks never conduct KYC updates.',
        isCorrect: false,
        explanation: 'Banks do require Periodic Updation of KYC, but they require you to do it through official branches or their official authenticated netbanking.'
      },
      {
        id: 'opt_3b',
        text: 'The root domain is "portal-kyc.in", NOT "onlinesbi.sbi" or "sbi.co.in". "onlinesbi.co" is only a deceptive subdomain.',
        isCorrect: true,
        explanation: 'Excellent analysis! Attackers prepend brand names as subdomains (e.g. onlinesbi.co.portal-kyc.in) so victims overlook the true controlling domain at the end. Furthermore, SMS headers can be spoofed or leased by rogue telemarketers.'
      },
      {
        id: 'opt_3c',
        text: 'The link uses HTTPS, which proves it is genuine.',
        isCorrect: false,
        explanation: 'A dangerous myth! Over 80% of modern phishing domains use HTTPS certificates (often free via Let’s Encrypt or Cloudflare). HTTPS only encrypts the connection; it does not verify the owner is honest.'
      },
      {
        id: 'opt_3d',
        text: 'The URL does not have www in front.',
        isCorrect: false,
        explanation: 'Many legitimate websites operate without www; domain structure and ownership are what matter.'
      }
    ],
    suspiciousIndicators: [
      'Subdomain brand spoofing (onlinesbi is merely a subdomain of portal-kyc.in)',
      'Artificial threat of account suspension "today"',
      'Requests login credentials via an external web form',
      'RBI guidelines strictly forbid banks from sending clickable login links via SMS'
    ],
    safeFictionalContext: 'Safe fictional exercise demonstrating subdomain spoofing and header trust fallacies.',
    points: 150
  },
  {
    id: 'sim_int_02',
    difficulty: 'INTERMEDIATE',
    category: 'Work-from-Home & Task Fraud',
    scenarioTitle: 'The "YouTube Video Like & Earn" Job Opportunity',
    senderProfile: 'WhatsApp from: +62 812-XXXX-XXXX (Overseas Country Code)',
    messageText: 'Hello! I am HR Jessica from Global Media Agency. We are hiring part-time video reviewers. You can earn ₹3,000 to ₹8,000 per day simply by liking YouTube videos and rating hotels on Google. No experience required. We pay ₹150 for trial task! Reply 1 to join our VIP Telegram group.',
    question: 'What is the underlying business model of this fraudulent scheme?',
    options: [
      {
        id: 'opt_4a',
        text: 'They sell your YouTube email to advertising companies.',
        isCorrect: false,
        explanation: 'While contact sharing happens, that is not how they extract thousands from victims.'
      },
      {
        id: 'opt_4b',
        text: 'It is a "Pig Butchering / Task Scam": they pay small rewards first (₹150-₹500) to build trust, then demand "prepaid task deposits" of tens of thousands that you can never withdraw.',
        isCorrect: true,
        explanation: 'Spot on! Known globally as the "Task/Prepaid Scam", fraudsters lure victims with tiny real payouts, then introduce "Crypto / Merchant investment tasks" requiring ₹50,000+ deposits which are immediately stolen.'
      },
      {
        id: 'opt_4c',
        text: 'It is a legitimate digital marketing promotional agency.',
        isCorrect: false,
        explanation: 'No legitimate agency recruits random individuals via foreign WhatsApp numbers to artificially inflate YouTube metrics.'
      },
      {
        id: 'opt_4d',
        text: 'They want to hack your YouTube channel.',
        isCorrect: false,
        explanation: 'The primary target is your bank account and savings via psychological manipulation.'
      }
    ],
    suspiciousIndicators: [
      'Unsolicited job offer from an international country code (+62 Indonesia)',
      'Unrealistic compensation (₹8,000/day for zero skills)',
      'Migration from WhatsApp to Telegram channels to evade law enforcement',
      'Small trial payout hook designed to establish false legitimacy'
    ],
    safeFictionalContext: 'Safe simulated scenario based on the pervasive Telegram Task Scam.',
    points: 150
  },

  // ADVANCED LEVEL
  {
    id: 'sim_adv_01',
    difficulty: 'ADVANCED',
    category: 'Digital Arrest & Coercion',
    scenarioTitle: 'The "Digital Arrest" & Fake Law Enforcement Summons',
    senderProfile: 'WhatsApp Video Call / Notice from: "CBI Cyber Cell Inspector"',
    messageText: 'NOTICE UNDER SEC 91 CrPC: A courier containing contraband items and forged passports was intercepted in Mumbai under your Aadhaar number. A non-bailable arrest warrant has been issued. You are placed under DIGITAL ARREST. You must remain on video camera for verification and transfer funds to the Reserve Bank Escrow Account for asset verification or police will arrive in 1 hour.',
    question: 'Which of the following statements about "Digital Arrest" is TRUE according to Indian Law & Police authorities?',
    options: [
      {
        id: 'opt_5a',
        text: 'Police can arrest citizens virtually over Skype or WhatsApp under special cyber emergency rules.',
        isCorrect: false,
        explanation: 'Completely FALSE. The Supreme Court and Ministry of Home Affairs (MHA) have repeatedly clarified that "Digital Arrest" DOES NOT EXIST in Indian Law.'
      },
      {
        id: 'opt_5b',
        text: '"Digital Arrest" is an entirely fabricated cyber extortion tactic. No law enforcement agency or court conducts trials or asset verification transfers over video calls.',
        isCorrect: true,
        explanation: 'Correct! Both the Prime Minister and CBI have issued national warnings: Law enforcement never conducts arrests via WhatsApp/Skype and NEVER asks citizens to transfer money to "RBI verification accounts". Immediately report to 1930.'
      },
      {
        id: 'opt_5c',
        text: 'Transferring money to an RBI escrow account is safe because the funds return in 48 hours.',
        isCorrect: false,
        explanation: 'RBI has no "verification escrow accounts" for private citizen funds. Any money sent to these mule accounts is instantly withdrawn at ATMs across borders.'
      },
      {
        id: 'opt_5d',
        text: 'You should stay in the room alone until the video call concludes.',
        isCorrect: false,
        explanation: 'Scammers demand isolation to prevent you from speaking with family or real police officers who would instantly expose the hoax.'
      }
    ],
    suspiciousIndicators: [
      'Fabricated concept of "Digital Arrest" which has no legal standing',
      'Demand to stay on video camera alone (psychological isolation)',
      'Request to transfer personal funds to a "government verification account"',
      'Extreme intimidation with fake legal jargon (CrPC, non-bailable warrants)'
    ],
    safeFictionalContext: 'Fictional simulation educating citizens on the dangerous "Digital Arrest" extortion racket.',
    points: 200
  },
  {
    id: 'sim_adv_02',
    difficulty: 'ADVANCED',
    category: 'UPI QR Payment Reversal Trap',
    scenarioTitle: 'The "Scan QR Code to Receive Money" Trap',
    senderProfile: 'Buyer on Marketplace / WhatsApp: +91-98123-XXXXX',
    messageText: 'Buyer: "I am ready to buy your old sofa for ₹12,000 right now. I have sent an official PhonePe merchant QR code. Open your PhonePe, scan this QR code, and enter your UPI PIN to claim the ₹12,000 credit into your bank account."',
    question: 'What fundamental rule of the Unified Payments Interface (UPI) proves this is a theft attempt?',
    options: [
      {
        id: 'opt_6a',
        text: 'PhonePe does not support transactions over ₹10,000.',
        isCorrect: false,
        explanation: 'Standard UPI transaction limits are up to ₹1,00,000 per day; the amount is not the issue.'
      },
      {
        id: 'opt_6b',
        text: 'You NEVER need to scan a QR code or enter your UPI PIN to RECEIVE money.',
        isCorrect: true,
        explanation: 'Fundamental UPI Law: UPI PIN is ONLY entered when money is LEAVING your account. Scanning a QR code and entering your PIN authorizes a debit/payment from your account, never a credit.'
      },
      {
        id: 'opt_6c',
        text: 'QR codes can only be used in physical grocery stores.',
        isCorrect: false,
        explanation: 'QR codes are used widely, but they represent payment requests, not collection receipts.'
      },
      {
        id: 'opt_6d',
        text: 'The buyer should have used Google Pay instead.',
        isCorrect: false,
        explanation: 'All UPI apps (Google Pay, Paytm, BHIM, PhonePe) share the exact same cryptographic rules.'
      }
    ],
    suspiciousIndicators: [
      'Instructing the recipient to enter their secret UPI PIN to receive funds',
      'Sending a payment request masquerading as a payment voucher',
      'Over-eager buyer willing to pay full price without inspecting the goods',
      'Confusing the victim with manipulated QR code graphics'
    ],
    safeFictionalContext: 'Safe educational scenario demonstrating UPI architecture and PIN mechanics.',
    points: 200
  }
];
