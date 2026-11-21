import React from 'react';
import { RiskLevel } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const getDetails = () => {
    switch (level) {
      case 'HIGH':
        return {
          label: 'High Risk',
          classes: 'bg-red-500/15 text-red-300 border-red-500/40 shadow-sm shadow-red-500/10',
          icon: <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
        };
      case 'MEDIUM':
        return {
          label: 'Medium Risk',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
        };
      case 'LOW':
      default:
        return {
          label: 'Low Risk',
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
        };
    }
  };

  const { label, classes, icon } = getDetails();

  return (
    <span className={`inline-flex items-center rounded-full border ${classes} ${sizeClasses[size]}`}>
      {showIcon && icon}
      <span>{label}</span>
      {typeof score === 'number' && (
        <span className="opacity-80 font-mono">({score}/100)</span>
      )}
    </span>
  );
};
