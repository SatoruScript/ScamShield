import { RegionalThreatCase } from './types';

export const REGIONAL_THREAT_LIBRARY: RegionalThreatCase[] = [
  // ASSAM & NORTH-EAST
  {
    id: 'reg_as_01',
    region: 'Assam & North-East',
    language: 'Assamese',
    threatTitle: 'APDCL Fake Electricity Disconnection Notice (বিদ্যুৎ বিল বন্ধৰ জাননী)',
    targetDemographic: 'Homeowners, shopkeepers, and elderly consumers in Assam',
    modusOperandi: 'Scammers dispatch SMS alerts in Assamese or Hinglish claiming electricity connection will be severed at 9:30 PM due to pending bills. They provide an unverified personal mobile number of a fake "APDCL Junior Engineer" who asks the victim to install AnyDesk/TeamViewer or pay via unverified UPI.',
    deceptivePhrases: [
      {
        originalText: 'প্ৰিয় গ্ৰাহক, আপোনাৰ বিদ্যুৎ বিল আদায় নিদিয়াৰ বাবে আজি নিশা বিদ্যুৎ সংযোগ বিচ্ছিন্ন কৰা হ’ব।',
        transliterationOrTranslation: 'Dear customer, your electricity connection will be disconnected tonight due to unpaid bill.',
        scamIntent: 'Artificial urgency and fear exploitation of power loss.'
      },
      {
        originalText: 'তৎক্ষণাৎ এই নম্বৰত ফোন কৰক: ৯৮XXXXXX',
        transliterationOrTranslation: 'Immediately call this phone number: 98XXXXXX',
        scamIntent: 'Directs victim to a scammer rather than the official 1912 APDCL helpline.'
      }
    ],
    officialAdvisorySource: 'Assam Power Distribution Company Limited (APDCL) & Assam Police Cyber Crime Cell',
    verifiedRemedies: [
      'APDCL never sends personal 10-digit mobile numbers for bill settlement.',
      'Only use the official "myBijli" mobile app or https://www.apdcl.org to check outstanding dues.',
      'Call the official APDCL 24x7 toll-free helpline at 1912.'
    ]
  },
  {
    id: 'reg_as_02',
    region: 'Assam & North-East',
    language: 'Assamese',
    threatTitle: 'Assam Direct Recruitment Fake Admit Cards & Appointment Letters (চাকৰিৰ ভুৱা প্ৰলোভন)',
    targetDemographic: 'Students, graduates, and job aspirants in Assam & Northeast India',
    modusOperandi: 'Fraudsters create lookalike websites imitating SEBA or SLRC (State Level Recruitment Commission), sending WhatsApp links promising direct appointment letters for Grade III/IV government posts upon paying a "medical examination" or "security fee" via UPI.',
    deceptivePhrases: [
      {
        originalText: 'অভিনন্দন! অসম চৰকাৰৰ তৃতীয় বৰ্গৰ চাকৰিৰ বাবে আপোনাৰ নিৰ্বাচন হৈছে। যোগদান পত্ৰৰ বাবে লিংক ক্লিক কৰক।',
        transliterationOrTranslation: 'Congratulations! You have been selected for Assam Govt Grade 3 job. Click link for appointment letter.',
        scamIntent: 'Exploiting youth employment aspirations through fake appointment promises.'
      },
      {
        originalText: 'নিযুক্তি পত্ৰ পাবলৈ ২৫০০ টকা ছিকিউৰিটি ফি জমা দিয়ক।',
        transliterationOrTranslation: 'Deposit ₹2500 security fee to receive appointment letter.',
        scamIntent: 'Upfront fee fraud with zero legitimate employment.'
      }
    ],
    officialAdvisorySource: 'Guwahati Police Cyber Cell & SLRC Official Advisory',
    verifiedRemedies: [
      'Government recruitment portals in Assam always operate strictly under ".assam.gov.in".',
      'The government never issues appointment orders through WhatsApp or unverified Telegram channels.',
      'Verify all recruitment notices at https://sebaonline.org or official department websites.'
    ]
  },

  // EASTERN INDIA (BENGAL & BIHAR)
  {
    id: 'reg_bn_01',
    region: 'Eastern India (Bengal/Bihar)',
    language: 'Bengali',
    threatTitle: 'WBSEDCL Power Disconnection & Quick Bill SMS Scam (বিদ্যুৎ বিল প্রতারণা)',
    targetDemographic: 'Residential power consumers in Kolkata and West Bengal districts',
    modusOperandi: 'Attackers send bulk SMS messages purporting to be from WBSEDCL claiming the power line will be cut within hours. Victims are pressured into downloading a "quick bill helper" (.apk) file which grants attackers full SMS interception privileges.',
    deceptivePhrases: [
      {
        originalText: 'প্রিয় গ্রাহক, আপনার বিদ্যুৎ বিল আপডেট নেই। আজ রাতে আপনার বিদ্যুৎ সংযোগ কেটে দেওয়া হবে। অবিলম্বে যোগাযোগ করুন।',
        transliterationOrTranslation: 'Dear customer, your electricity bill is not updated. Tonight your electricity line will be disconnected. Contact immediately.',
        scamIntent: 'Manufacturing evening panic to prevent physical verification at utility offices.'
      },
      {
        originalText: 'বিল আপডেট করার জন্য এই লিঙ্কে ক্লিক করে অ্যাপটি ডাউনলোড করুন।',
        transliterationOrTranslation: 'Click this link and download the app to update your bill.',
        scamIntent: 'Malicious Android APK installation for SMS OTP forwarding.'
      }
    ],
    officialAdvisorySource: 'West Bengal State Electricity Distribution Co. (WBSEDCL) & Kolkata Police Cyber Crime',
    verifiedRemedies: [
      'WBSEDCL official SMS sender IDs always start with "WBSEDCL" (e.g., AD-WBSEDCL, VM-WBSEDCL).',
      'Never install APK files sent through messaging apps. Official app is only available on Google Play Store ("Vidyut Sahayogi").',
      'Verify bills only on https://www.wbsedcl.in or call 19121.'
    ]
  },
  {
    id: 'reg_bn_02',
    region: 'Eastern India (Bengal/Bihar)',
    language: 'Bengali',
    threatTitle: 'PM Awas Yojana / State Welfare Direct Benefit Subsidy Trap',
    targetDemographic: 'Rural and semi-urban beneficiaries awaiting government welfare housing',
    modusOperandi: 'Con artists pose as local Panchayat or Municipal officers, calling beneficiaries to claim a government housing grant of ₹1,20,000 is approved. They instruct the victim to send a "processing registration fee" of ₹5,000 via UPI to unlock the DBT transfer.',
    deceptivePhrases: [
      {
        originalText: 'আপনার আবাস যোজনার ১,২০,০০০ টাকা মঞ্জুর হয়েছে। টাকা পেতে রেজিস্ট্রেশন ফি পাঠান।',
        transliterationOrTranslation: 'Your housing scheme grant of ₹1,20,000 is sanctioned. Send registration fee to receive funds.',
        scamIntent: 'Advance-fee extortion masquerading as government welfare.'
      }
    ],
    officialAdvisorySource: 'Ministry of Rural Development & PIB Fact Check',
    verifiedRemedies: [
      'Government welfare schemes under Direct Benefit Transfer (DBT) NEVER require beneficiaries to pay advance fees.',
      'Subsidies are credited directly to Aadhaar-seeded bank accounts without third-party UPI links.'
    ]
  },

  // PAN-INDIA NATIONAL
  {
    id: 'reg_hi_01',
    region: 'Pan-India National',
    language: 'Hindi',
    threatTitle: 'Traffic Police E-Challan Fake APK Scam (ई-चालान फर्जी मैसेज)',
    targetDemographic: 'Vehicle owners across major Indian cities and highways',
    modusOperandi: 'Vehicle owners receive an SMS stating that a traffic violation challan has been issued against their car or bike. The message provides a link to download "e-challan.apk", which installs remote access spyware that silently steals banking OTPs.',
    deceptivePhrases: [
      {
        originalText: 'यातायात पुलिस सूचना: आपके वाहन का ₹1500 का ई-चालान लंबित है। कोर्ट चालान से बचने के लिए तुरंत भुगतान करें।',
        transliterationOrTranslation: 'Traffic Police Notice: Pending e-challan of ₹1500 on your vehicle. Pay immediately to avoid court summons.',
        scamIntent: 'Legal intimidation to compel reckless clicking on malicious APK links.'
      },
      {
        originalText: 'चालान विवरण देखने और भुगतान के लिए नीचे दिए गए लिंक से सरकारी ऐप इंस्टॉल करें: http://echallan-pay.top/app',
        transliterationOrTranslation: 'Install govt app from link below to view challan and pay: http://echallan-pay.top/app',
        scamIntent: 'Distributing trojanized APK to steal banking credentials.'
      }
    ],
    officialAdvisorySource: 'Ministry of Road Transport and Highways (MoRTH) & Indian Cyber Crime Coordination Centre (I4C)',
    verifiedRemedies: [
      'Official government challan portal is ONLY: https://echallan.parivahan.gov.in',
      'Traffic police never distribute APK installation files via SMS.',
      'Check vehicle fines exclusively through the official Parivahan portal or mParivahan app.'
    ]
  },
  {
    id: 'reg_hi_02',
    region: 'Pan-India National',
    language: 'Hindi',
    threatTitle: 'Digital Arrest & Virtual Police Extortion (डिजिटल अरेस्ट ठगी)',
    targetDemographic: 'Retirees, professionals, and senior citizens living alone',
    modusOperandi: 'Impersonators wearing police/customs uniforms on Skype or WhatsApp video calls accuse the victim of involvement in money laundering or narcotics couriers. They force the victim into continuous 24-48 hour virtual surveillance and extort life savings into fake "RBI security accounts".',
    deceptivePhrases: [
      {
        originalText: 'आप पर मनी लॉन्ड्रिंग का केस दर्ज हुआ है। आपको डिजिटल अरेस्ट किया जाता है। किसी से बात न करें।',
        transliterationOrTranslation: 'A money laundering case is registered against you. You are placed under digital arrest. Do not talk to anyone.',
        scamIntent: 'Extreme fear exploitation and complete social isolation.'
      },
      {
        originalText: 'जांच पूरी होने तक अपने सभी बैंक खातों का पैसा आरबीआई के सुरक्षा खाते में ट्रांसफर करें।',
        transliterationOrTranslation: 'Transfer all your bank money to RBI security verification account until inquiry finishes.',
        scamIntent: 'Extorting life savings under false pretexts of governmental clearance.'
      }
    ],
    officialAdvisorySource: 'Prime Minister of India (Mann Ki Baat Nov 2024), Supreme Court of India, CBI & I4C Helpline 1930',
    verifiedRemedies: [
      '"Digital Arrest" has NO legal existence in Indian law. Police and CBI never arrest anyone over video calls.',
      'RBI has no "security escrow accounts" for private funds.',
      'If someone threatens you on a video call, hang up immediately and dial 1930 or visit your local police station.'
    ]
  }
];
