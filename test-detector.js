const { runDeterministicDetection, extractAndAnalyzeUrls } = require('./src/lib/detector');
const { analyzeUrlSafety } = require('./src/lib/urlAnalyzer');

console.log('====================================================');
console.log('🛡️  SCAMSHIELD AUTOMATED VERIFICATION TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failCount++;
  }
}

// TEST 1: Suspicious Banking Notification
console.log('--- Test 1: Suspicious Banking Notification ---');
const bankSms = 'Dear Customer, Your SBI Bank account will be suspended today! Verify your KYC immediately using the link below: http://sbi-kyc-verify.xyz/update to avoid account closure.';
const res1 = runDeterministicDetection(bankSms);
assert(res1.riskLevel === 'HIGH', 'Banking KYC freeze detected as HIGH risk', `Score: ${res1.score}`);
assert(res1.detectedIndicators.some(i => i.id === 'urg_account_suspension'), 'Urgent account suspension flagged');
assert(res1.detectedIndicators.some(i => i.id === 'fake_kyc_mandate'), 'Fake KYC mandate flagged');
assert(res1.extractedUrls.length === 1, 'Extracted malicious link');
assert(res1.extractedUrls[0].flags.some(f => f.includes('Deceptive impersonation')), 'Deceptive SBI subdomain flagged');

// TEST 2: Suspicious Delivery Notification
console.log('\n--- Test 2: Fake Delivery Notification ---');
const deliverySms = 'India Post: Your package cannot be delivered due to incomplete street address. Please update your delivery details within 24 hours at http://indiapost-parcel.top/update or parcel will be returned.';
const res2 = runDeterministicDetection(deliverySms);
assert(res2.riskLevel === 'MEDIUM' || res2.riskLevel === 'HIGH', 'Delivery parcel trap flagged with elevated risk', `Score: ${res2.score}`);
assert(res2.detectedIndicators.some(i => i.id === 'fake_delivery_parcel'), 'Delivery parcel failure flagged');

// TEST 3: OTP Solicitation Scam
console.log('\n--- Test 3: OTP Solicitation Scam ---');
const otpSms = 'Urgent from Bank: A debit of Rs 50,000 is pending. Share the OTP sent to your phone immediately to stop this transaction.';
const res3 = runDeterministicDetection(otpSms);
assert(res3.riskLevel === 'HIGH', 'OTP solicitation detected as HIGH risk', `Score: ${res3.score}`);
assert(res3.detectedIndicators.some(i => i.id === 'req_otp_pin'), 'Credential/OTP theft flagged');

// TEST 4: Legitimate Doctor Appointment
console.log('\n--- Test 4: Legitimate Doctor Appointment ---');
const legitMsg = 'Your appointment with Dr. Sharma is confirmed for tomorrow, Monday at 10:30 AM at Metro Clinic, Guwahati. Please arrive 10 minutes early. To reschedule, reply to this message.';
const res4 = runDeterministicDetection(legitMsg);
assert(res4.riskLevel === 'LOW', 'Doctor appointment detected as LOW risk', `Score: ${res4.score}`);
assert(res4.detectedIndicators.length === 0, 'No false positive indicators triggered');

// TEST 5: Legitimate Bank OTP Transaction
console.log('\n--- Test 5: Legitimate Bank OTP Transaction ---');
const legitOtp = '124890 is your OTP for purchase of Rs 1,450 at Flipkart on HDFC Bank Card ending 4092. Valid for 10 mins. NEVER share your OTP or password with anyone, even bank officials.';
const res5 = runDeterministicDetection(legitOtp);
assert(res5.riskLevel === 'LOW' || res5.score < 30, 'Legitimate bank notification remains LOW risk heuristic', `Score: ${res5.score}`);

// TEST 6: Regional Language Scam (Assamese Transliterated)
console.log('\n--- Test 6: Regional Language Scam (Assamese) ---');
const assameseSms = 'Apuni janibo je apunar bank account aajiye bondho hobo! Tatkhalik bhabe KYC update kori liyok http://sbi-assam-verify.xyz/login sombad na pale khata permanent freeze hobo.';
const res6 = runDeterministicDetection(assameseSms);
assert(res6.riskLevel === 'HIGH', 'Regional Assamese scam flagged as HIGH risk', `Score: ${res6.score}`);
assert(res6.languageDetected.includes('Assamese'), 'Correctly detected Assamese language', res6.languageDetected);

// TEST 7: Raw IP Host URL Analysis
console.log('\n--- Test 7: Dedicated URL Analyzer on Raw IP Host ---');
const urlRes = analyzeUrlSafety('http://185.220.101.5:8080/banking/login.php');
assert(urlRes.riskLevel === 'HIGH', 'Raw numerical IP hostname flagged as HIGH risk', `Score: ${urlRes.riskScore}`);
assert(urlRes.indicators.some(i => i.id === 'ip_hostname'), 'IP address indicator flagged');
assert(urlRes.indicators.some(i => i.id === 'no_https'), 'Insecure HTTP flagged');
assert(urlRes.indicators.some(i => i.id === 'non_standard_port'), 'Non-standard port 8080 flagged');

// TEST 8: URL Shortener Inspection
console.log('\n--- Test 8: URL Shortener Inspection ---');
const shortRes = analyzeUrlSafety('https://bit.ly/urgent-account-update');
assert(shortRes.indicators.some(i => i.id === 'url_shortener'), 'URL shortener flagged');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed.`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
