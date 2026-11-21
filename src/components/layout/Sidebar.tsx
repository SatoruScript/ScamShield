'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  LayoutDashboard, 
  MessageSquareWarning, 
  Link2, 
  History, 
  GraduationCap, 
  Settings, 
  ExternalLink,
  Lock,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'System overview & live telemetry',
    },
    {
      name: 'Message Scanner',
      href: '/scanner',
      icon: MessageSquareWarning,
      badge: 'Core',
      description: 'Analyze SMS, WhatsApp & texts',
    },
    {
      name: 'URL Analyzer',
      href: '/url-analyzer',
      icon: Link2,
      description: 'Inspect suspicious domains',
    },
    {
      name: 'Scan History',
      href: '/history',
      icon: History,
      description: 'Locally saved scan logs',
    },
    {
      name: 'Safety Centre',
      href: '/safety',
      icon: GraduationCap,
      description: 'Scam mechanics & drills',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Model & local privacy',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#0D1525] border-r border-[#23334C] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#23334C]">
          <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-glow-primary">
              <div className="w-full h-full bg-[#080D18] rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">ScamShield</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary uppercase tracking-wider">AI</span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Don't Trust. Verify.</p>
            </div>
          </Link>
        </div>

        {/* Hackathon Badge */}
        <div className="px-5 py-3 border-b border-[#23334C]/60 bg-[#080D18]/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              PromptWars 2026
            </span>
            <span className="text-[10px] font-mono text-slate-400">Guwahati Univ</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary/10 border border-primary/30 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111C30]/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
                    isActive ? 'bg-primary text-[#080D18]' : 'bg-[#23334C] text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Security Engine Telemetry status card */}
        <div className="p-4 m-4 rounded-xl border border-[#23334C] bg-[#111C30]/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Hybrid Analysis
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">ONLINE</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Rule Engine:</span>
              <span className="text-slate-200 font-mono">Deterministic v1.4</span>
            </div>
            <div className="flex justify-between">
              <span>AI Explainer:</span>
              <span className="text-slate-200 font-mono">Gemini GenAI</span>
            </div>
            <div className="flex justify-between">
              <span>Privacy Mode:</span>
              <span className="text-slate-200 font-mono">Local State Only</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="p-4 border-t border-[#23334C] text-center text-[11px] text-slate-400">
          <p>© 2026 ScamShield. All rights reserved.</p>
        </div>
      </aside>
    </>
  );
};
