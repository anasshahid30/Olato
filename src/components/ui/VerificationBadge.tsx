import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { getRelativeTimeString } from '@/lib/distance';

interface VerificationBadgeProps {
  lastVerifiedDate: string;
  confidence?: number;
  showDetail?: boolean;
  status?: string;
  className?: string;
}

export function VerificationBadge({
  lastVerifiedDate,
  confidence = 98,
  showDetail = true,
  status = 'Active',
  className = '',
}: VerificationBadgeProps) {
  const isVerified = confidence >= 90 && status === 'Active';
  const timeString = getRelativeTimeString(lastVerifiedDate);

  if (!isVerified) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-[#F59E0B] font-medium ${className}`}>
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span>Verification Pending</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8FAF2] text-[#19B87A] text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#19B87A]" />
        <span>Verified</span>
      </span>
      {showDetail && (
        <span suppressHydrationWarning className="text-xs text-[#6F7078] font-normal">
          {timeString.toLowerCase().includes('ago') ? `Verified ${timeString}` : `Verified ${timeString}`}
        </span>
      )}
    </div>
  );
}
