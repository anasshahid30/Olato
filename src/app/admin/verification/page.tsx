'use client';

import React, { useState, useEffect } from 'react';
import { repository } from '@/lib/repository';
import { Discount } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { getRelativeTimeString } from '@/lib/distance';
import { CheckCircle2, ShieldAlert, RefreshCw, XCircle, ShieldCheck } from 'lucide-react';

export default function VerificationQueuePage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDiscounts(repository.getDiscounts({}));
  };

  const handleVerify = (id: string) => {
    repository.verifyDiscount(id, 'Active', 99);
    refreshData();
  };

  const handleMarkPending = (id: string) => {
    repository.verifyDiscount(id, 'Pending Verification', 50);
    refreshData();
  };

  const handleDeactivate = (id: string) => {
    repository.verifyDiscount(id, 'Inactive', 0);
    refreshData();
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#15151A]">Verification Audit Queue</h1>
          <p className="text-sm text-[#6F7078] mt-0.5">
            Audit merchant offer validity dates, update last verified timestamps, and manage consumer trust status
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={refreshData} icon={<RefreshCw className="w-4 h-4" />}>
          Refresh Queue
        </Button>
      </div>

      <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E7E7EC] text-xs font-bold text-[#6F7078] uppercase tracking-wider">
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Offer Title</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Last Verified</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7EC]/60">
              {discounts.map((d) => {
                const relativeTime = getRelativeTimeString(d.lastVerifiedDate);
                const isHighlyVerified = d.confidence >= 90 && d.status === 'Active';

                return (
                  <tr key={d.id} className="hover:bg-[#F7F7FA]">
                    <td className="py-4 px-4 font-bold text-[#15151A]">{d.placeName}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-[#15151A] max-w-[220px] truncate">
                      {d.offerTitle}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-[#19B87A]">{d.discountDetails}</td>
                    <td className="py-4 px-4 text-xs text-[#6F7078]">{relativeTime}</td>
                    <td className="py-4 px-4 font-bold text-xs text-[#19B87A]">{d.confidence}%</td>
                    <td className="py-4 px-4">
                      {isHighlyVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8FAF2] text-[#19B87A] text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#F59E0B] text-xs font-bold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {d.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleVerify(d.id)}
                        icon={<ShieldCheck className="w-3.5 h-3.5" />}
                      >
                        Verify Now
                      </Button>
                      <button
                        onClick={() => handleMarkPending(d.id)}
                        className="px-2.5 py-1 text-xs font-bold text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-colors"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleDeactivate(d.id)}
                        className="px-2.5 py-1 text-xs font-bold text-[#EF4444] hover:bg-[#FFF5F5] rounded-lg transition-colors"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
