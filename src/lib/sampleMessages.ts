export interface SampleMessage {
  id: string;
  category: 'BANKING' | 'DELIVERY' | 'PRIZE' | 'UTILITY' | 'JOB' | 'LEGITIMATE' | 'REGIONAL';
  title: string;
  tag: string;
  expectedRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  source: 'SMS' | 'WHATSAPP' | 'EMAIL';
  text: string;
  description: string;
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: 'sample_bank_kyc',
    category: 'BANKING',
    title: 'Urgent Bank KYC Freeze Notice',
    tag: 'Banking Phishing',
    expectedRisk: 'HIGH',
    source: 'SMS',
    text: 'Dear Customer, Your SBI Bank account will be suspended today! Verify your KYC immediately using the link below: http://sbi-kyc-verify.xyz/update to avoid permanent account closure.',
    description: 'Classic high-urgency bank impersonation creating artificial fear of account suspension to steal credentials.',
  },
  {
    id: 'sample_delivery_customs',
    category: 'DELIVERY',
    title: 'India Post Delivery Failure',
    tag: 'Delivery Trap',
    expectedRisk: 'MEDIUM',
    source: 'SMS',
    text: 'India Post: Your package cannot be delivered due to incomplete street address. Please update your delivery details within 24 hours at http://indiapost-parcel.top/update or parcel will be returned.',
    description: 'Postal service impersonation exploiting parcel anxiety and directing recipients to a suspicious .top link.',
  },
  {
    id: 'sample_lottery_prize',
    category: 'PRIZE',
    title: 'KBC Lottery / Cash Reward Bait',
    tag: 'Lottery Fraud',
    expectedRisk: 'HIGH',
    source: 'WHATSAPP',
    text: 'Congratulations! Your mobile number has won a cash prize of Rs 25,00,000 in the KBC All India Lucky Draw 2026. Send your Aadhaar and bank details to WhatsApp officer on 9876543210 immediately to claim.',
    description: 'Unsolicited lottery scam targeting greed and soliciting sensitive identity documents.',
  },
  {
    id: 'sample_utility_bijli',
    category: 'UTILITY',
    title: 'Electricity Disconnection Scam',
    tag: 'Utility Scam',
    expectedRisk: 'HIGH',
    source: 'SMS',
    text: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was unpaid. Immediately call electricity officer at 9123456789.',
    description: 'Time-pressured utility blackout threat prompting victims to call a fraudster posing as an officer.',
  },
  {
    id: 'sample_assamese_scam',
    category: 'REGIONAL',
    title: 'Regional: Assamese KYC Alert',
    tag: 'Regional Scam',
    expectedRisk: 'HIGH',
    source: 'SMS',
    text: 'Apuni janibo je apunar bank account aajiye bondho hobo! Tatkhalik bhabe KYC update kori liyok http://sbi-assam-verify.xyz/login sombad na pale khata permanent freeze hobo.',
    description: 'Assamese transliterated phishing SMS exploiting local language to bypass English-only filters.',
  },
  {
    id: 'sample_job_telegram',
    category: 'JOB',
    title: 'Work-From-Home YouTube Task',
    tag: 'Task Fraud',
    expectedRisk: 'MEDIUM',
    source: 'WHATSAPP',
    text: 'Earn Rs 3000 to Rs 8000 daily from home! Simple part-time job: just like YouTube videos and write hotel reviews. No experience needed. Join our official Telegram channel now: https://t.me/fake_task_rewards',
    description: 'Part-time job task scam that lures victims into fraudulent investment deposits.',
  },
  {
    id: 'sample_doctor_legit',
    category: 'LEGITIMATE',
    title: 'Standard Doctor Appointment',
    tag: 'Genuine Message',
    expectedRisk: 'LOW',
    source: 'SMS',
    text: 'Your appointment with Dr. Sharma is confirmed for tomorrow, Monday at 10:30 AM at Metro Clinic, Guwahati. Please arrive 10 minutes early. To reschedule, reply to this message or call 0361-2345678.',
    description: 'Ordinary appointment confirmation containing no threats, urgency manipulation, or suspicious links.',
  },
  {
    id: 'sample_bank_otp_legit',
    category: 'LEGITIMATE',
    title: 'Legitimate Bank Transaction OTP',
    tag: 'Genuine OTP Alert',
    expectedRisk: 'LOW',
    source: 'SMS',
    text: '124890 is your OTP for purchase of Rs 1,450 at Flipkart on HDFC Bank Card ending 4092. Valid for 10 mins. NEVER share your OTP or password with anyone, even bank officials.',
    description: 'Genuine bank OTP containing standard security warnings reminding the user never to share it.',
  },
  {
    id: 'sample_digital_arrest',
    category: 'BANKING',
    title: 'CBI "Digital Arrest" Voice Transcript',
    tag: 'Vishing / Digital Arrest',
    expectedRisk: 'HIGH',
    source: 'WHATSAPP',
    text: 'ALERT: This is CBI Cyber Cell Inspector Sharma speaking. Your Aadhaar card has been used to open a bank account in Mumbai involved in Rs 6.8 Crore money laundering and illegal narcotics trafficking. You are under virtual Digital Arrest. Do not disconnect the video call or inform family members, or immediate police arrest warrants will be executed at your residence.',
    description: 'High-severity authority impersonation ("Digital Arrest") scam transcript threatening fake criminal prosecution.',
  },
  {
    id: 'sample_customs_parcel',
    category: 'DELIVERY',
    title: 'Mumbai Customs Narcotic Parcel Scam',
    tag: 'Customs Fraud',
    expectedRisk: 'HIGH',
    source: 'WHATSAPP',
    text: 'Mumbai Customs Department: A parcel addressed in your name containing 5 passports, MDMA drugs, and 3 laptops has been intercepted at Mumbai International Airport. Please connect immediately via video call with Narcotics Control Bureau officer or your bank accounts will be frozen under anti-terrorism acts.',
    description: 'Customs parcel scam creating extreme fear of drug trafficking charges to extort money transfers.',
  },
];
