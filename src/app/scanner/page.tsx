'use client';

import React, { useState, useEffect } from 'react';
import { MessageScanner } from '@/components/scanner/MessageScanner';

export default function ScannerPage() {
  const [initialText, setInitialText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('scamshield_quick_text');
      if (stored) {
        setInitialText(stored);
        sessionStorage.removeItem('scamshield_quick_text');
      }
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Suspicious Message Scanner</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detect phishing patterns, credential solicitation, and deceptive links in SMS, WhatsApp, and email messages.
        </p>
      </div>

      <MessageScanner initialMessage={initialText} />
    </div>
  );
}
