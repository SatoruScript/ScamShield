import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'ScamShield — AI-Powered Suspicious Message Detector',
  description: "Don't Trust. Verify. Explainable AI & Heuristic Anti-Phishing Defense Platform for Guwahati University ANIC PromptWars 2026-27.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080D18] text-[#F8FAFC] antialiased selection:bg-primary/30 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
