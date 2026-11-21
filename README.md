# 🛡️ ScamShield — AI-Powered Suspicious Message Detector
> **Tagline:** Don't Trust. Verify.  
> **Event:** Guwahati University ANIC 2026–27 PromptWars Hackathon  
> **Domain:** Cybersecurity & Explainable AI Threat Defense  

---

## 📌 Executive Summary

Every day, ordinary citizens, elderly users, and students receive fraudulent SMS and WhatsApp communications impersonating banks (SBI, HDFC), courier services (India Post), utility boards, and law enforcement (CBI "Digital Arrest"). Most victims fall prey not due to technical vulnerabilities, but due to manufactured emotional panic, urgency, and lookalike domain tricks.

**ScamShield** is an AI-powered cybersecurity web application that analyses suspicious digital communications, identifies deceptive patterns, explains the associated risks in plain language, and provides practical, actionable safety recommendations.

---

## ✨ Key Differentiators

1. **Explainable AI (XAI)**
   - ScamShield avoids opaque "black box" risk scores. It dissects *why* a message is dangerous, isolating psychological manipulation triggers (False Urgency, Greed, Authority Impersonation, Credential Theft) so users learn to recognize them independently.

2. **Deterministic Heuristic + Gemini Hybrid Engine**
   - **Architectural Guarantee:** AI explains the findings; it does *not* arbitrarily invent the security score.
   - The deterministic engine evaluates verified regex rules, linguistic triggers, and domain characteristics to compute a transparent 0–100 score.
   - If the Gemini API is offline or unconfigured, the application gracefully functions with full heuristic breakdown and safety checklists.

3. **Regional Language Awareness**
   - Built with support for **English**, **Hindi (Devanagari & Romanized)**, and **Assamese (transliterated & script)** to protect regional communities across Northeast India and beyond.

4. **Dedicated Safe URL Inspector**
   - Deeply analyzes web links without opening or loading malicious payloads. Checks for unencrypted HTTP, numerical IP hostnames, URL shorteners, multi-level deceptive subdomains (e.g. `sbi.verify.scam.top`), and lookalike typosquatting.

5. **Zero-Server Storage & Privacy First**
   - No private messages or sensitive communications are uploaded or retained on any remote server. Analysis history resides strictly inside the user's browser `LocalStorage`.

---

## 🚀 Live Demo & Screenshots

- **Live Dashboard:** `/` — Real-time telemetry metrics computed from local scan history, quick scan launcher, and prevalent scam alerts.
- **Message Scanner:** `/scanner` — Primary scanner with interactive sample messages, character counters, multi-phase scanning feedback, and comprehensive analysis reports.
- **URL Inspector:** `/url-analyzer` — Deconstructs URLs into protocol, subdomain, domain, and TLD with safety indicators.
- **Scan History:** `/history` — Filterable, searchable client-side scan logs with JSON export and privacy controls.
- **Safety Centre:** `/safety` — Educational interactive modules and a 3-question "Spot the Scam" interactive drill.
- **System Settings:** `/settings` — Model telemetry, privacy data management, and hackathon project metadata.

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | High-performance React web application |
| **Language** | TypeScript (Strict Mode) | Type-safe deterministic analysis logic |
| **Styling** | Tailwind CSS | Dark cybersecurity command center theme |
| **Icons** | Lucide React | Modern cybersecurity & telemetry iconography |
| **AI SDK** | Google Gemini (`@google/genai`) | Explainable threat narratives & advice synthesis |
| **State & History** | Browser LocalStorage | Privacy-first client-side scan logs |
| **Deployment** | Vercel | Production edge hosting |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google Gemini API key from Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Configurable Gemini Model (e.g. gemini-2.5-flash, gemini-1.5-flash, gemini-2.0-flash)
# Default fallback: gemini-2.5-flash
GEMINI_MODEL=gemini-2.5-flash
```

> **Note:** If `GEMINI_API_KEY` is omitted, ScamShield will automatically fall back to its deterministic heuristic engine. All scores, detected indicators, URL flags, and safety recommendations remain 100% operational!

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js >= 18.17 (Node 20 or 22 LTS recommended)
- npm or yarn

### Steps

```bash
# 1. Clone repository or navigate to project directory
cd scamshield

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Verification

```bash
# Run strict TypeScript and Next.js production build
npm run build

# Start production server
npm run start
```

---

## ☁️ Vercel Deployment Instructions

1. **Push to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete ScamShield MVP for PromptWars Hackathon"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Log in to [vercel.com](https://vercel.com).
   - Click **Add New...** -> **Project**.
   - Select your `scamshield` repository.
   - Framework Preset will auto-detect as **Next.js**.

3. **Configure Environment Variables in Vercel:**
   - In the **Environment Variables** section, add:
     - `GEMINI_API_KEY` = your Google Gemini API Key.
     - `GEMINI_MODEL` = `gemini-2.5-flash`

4. **Deploy:**
   - Click **Deploy**. Vercel will build and assign a production URL (e.g., `https://scamshield.vercel.app`).

---

## 🔒 Security & Safe Handling Disclosure

1. **No Automatic Navigation:** ScamShield does NOT fetch, preview, or execute submitted URLs or attachments. URL checks are conducted via safe DNS/string structural heuristics.
2. **Server-Side API Route:** The Gemini API Key is never exposed to the client or browser network tab; it is consumed exclusively in the Next.js server route (`/api/analyze`).
3. **Advisory Security Notice:** ScamShield provides automated heuristic and AI-assisted guidance. Results are advisory and cannot replace certified forensic law enforcement verification.

---

## 🏆 PromptWars 2026–27 Hackathon Submission
Developed with ❤️ for **Guwahati University ANIC PromptWars 2026–27**.
