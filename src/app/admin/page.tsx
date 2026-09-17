'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { repository } from '@/lib/repository';
import { OperationalMetrics, Discount } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import {
  Tag,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [recentDiscounts, setRecentDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    setMetrics(repository.getOperationalMetrics());
    setRecentDiscounts(repository.getDiscounts({ sortBy: 'relevant' }).slice(0, 5));
  }, []);

  if (!metrics) return null;

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#15151A]">Admin Dashboard Overview</h1>
          <p className="text-sm text-[#6F7078] mt-0.5">
            Operational metrics and data verification management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/discounts">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Discount
            </Button>
          </Link>
          <Link href="/admin/places">
            <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Place
            </Button>
          </Link>
        </div>
      </div>

      {/* OPERATIONAL METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E7E7EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Active Discounts</span>
            <div className="p-2 bg-[#E8FAF2] text-[#19B87A] rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#15151A]">{metrics.totalActiveDiscounts}</div>
          <p className="text-xs text-[#19B87A] font-semibold">Live in consumer discovery app</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E7EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Expiring Soon (7 Days)</span>
            <div className="p-2 bg-[#FFF5F5] text-[#EF4444] rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#15151A]">{metrics.expiringSoonCount}</div>
          <p className="text-xs text-[#6F7078]">Requires renewal or extension</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E7EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Pending Verification</span>
            <div className="p-2 bg-[#FEF3C7] text-[#F59E0B] rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#15151A]">{metrics.pendingVerificationCount}</div>
          <Link href="/admin/verification" className="text-xs font-bold text-[#5B5CE2] hover:underline block pt-1">
            Review Queue →
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E7EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Total Places</span>
            <div className="p-2 bg-[#EEF0FF] text-[#5B5CE2] rounded-xl">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#15151A]">{metrics.totalPlaces}</div>
          <p className="text-xs text-[#6F7078]">Cafés, Restaurants, & Featured</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E7EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Featured Places</span>
            <div className="p-2 bg-[#EEF0FF] text-[#5B5CE2] rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#15151A]">{metrics.featuredPlacesCount}</div>
          <p className="text-xs text-[#6F7078]">Showcased on homepage hero</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E7EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Verification Health Rate</span>
            <div className="p-2 bg-[#E8FAF2] text-[#19B87A] rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#19B87A]">{metrics.verificationHealthRate}%</div>
          <p className="text-xs text-[#19B87A] font-semibold">High confidence accuracy rate</p>
        </div>
      </div>

      {/* RECENT DISCOUNTS TABLE */}
      <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#15151A]">Recently Updated Offers</h2>
          <Link href="/admin/discounts" className="text-xs font-bold text-[#5B5CE2] hover:underline">
            Manage All Offers →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E7E7EC] text-xs font-bold text-[#6F7078] uppercase tracking-wider">
                <th className="py-3 px-4">Merchant / Place</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bank / Card</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7EC]/60">
              {recentDiscounts.map((d) => (
                <tr key={d.id} className="hover:bg-[#F7F7FA]">
                  <td className="py-3.5 px-4 font-bold text-[#15151A]">{d.placeName}</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#19B87A]">{d.discountDetails}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-[#5B5CE2]">{d.category}</td>
                  <td className="py-3.5 px-4 text-xs text-[#6F7078]">{d.bankCard || 'All Cards'}</td>
                  <td className="py-3.5 px-4">
                    <VerificationBadge lastVerifiedDate={d.lastVerifiedDate} confidence={d.confidence} showDetail={false} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8FAF2] text-[#19B87A] text-xs font-bold">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
