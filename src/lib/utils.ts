import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function getRiskColorClass(level: 'LOW' | 'MEDIUM' | 'HIGH'): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  glow: string;
} {
  switch (level) {
    case 'HIGH':
      return {
        bg: 'bg-red-950/40',
        text: 'text-red-400',
        border: 'border-red-500/40',
        badge: 'bg-red-500/20 text-red-300 border-red-500/50',
        glow: 'shadow-glow-danger',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        glow: 'shadow-glow-warning',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        glow: 'shadow-glow-success',
      };
  }
}
