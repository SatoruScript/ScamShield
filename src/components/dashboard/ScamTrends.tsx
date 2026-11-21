import React from 'react';
import { AlertOctagon, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const ScamTrends: React.FC = () => {
  const trends = [
    {
      title: 'Digital Arrest / Cyber Police Extortion',
      severity: 'CRITICAL',
      tag: 'Coercion & Extortion',
      description: 'Fraudsters pose as CBI or Police officers on Skype/WhatsApp, claiming a courier with narcotics was sent in your name and placing you under fake "digital arrest".',
      frequency: '+42% this month',
    },
    {
      title: 'Fake India Post Delivery Failure',
      severity: 'HIGH',
      tag: 'Smishing Phishing',
      description: 'SMS claims your parcel cannot be delivered due to an incomplete address, directing you to click an unverified .top/.xyz link to pay a Rs 5 re-delivery charge.',
      frequency: '+65% this month',
    },
    {
      title: 'Emergency KYC Account Freeze Trap',
      severity: 'HIGH',
      tag: 'Credential Harvesting',
      description: 'Threatens that your bank account or SIM will be blocked "today" unless you update PAN/Aadhaar credentials via an unverified link.',
      frequency: '+38% this month',
    },
    {
      title: 'Electricity Power Blackout Threat',
      severity: 'HIGH',
      tag: 'Utility Blackmail',
      description: 'Warns that power will be cut tonight at 9:30 PM due to an unpaid bill, urging the victim to call an unauthorized mobile number.',
      frequency: '+29% this month',
    },
  ];

  return (
    <div className="p-6 rounded-2xl border border-[#23334C] bg-[#111C30] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-white">Prevalent Scam Threats & Tactics</h3>
        </div>
        <Link
          href="/safety"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>Safety Guide</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {trends.map((trend, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-[#23334C] bg-[#080D18]/60 hover:border-slate-600 transition-colors space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-slate-200">{trend.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 uppercase font-semibold">
                {trend.severity}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {trend.description}
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
              <span>{trend.tag}</span>
              <span className="text-primary font-semibold">{trend.frequency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
