'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ShieldAlert, Sparkles, Plus, Terminal } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080D18]/90 backdrop-blur-md border-b border-[#23334C] px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#111C30] lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-mono text-slate-400 tracking-wider">
            SCAMSHIELD THREAT DEFENSE CENTER
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Model indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111C30] border border-[#23334C] text-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-slate-300">Explainable AI</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">Gemini</span>
        </div>

        {/* Quick Scan CTA */}
        <Link
          href="/scanner"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080D18] font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Scan Message</span>
        </Link>
      </div>
    </header>
  );
};
