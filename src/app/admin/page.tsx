'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { repository } from '@/lib/repository';
import { OperationalMetrics, Discount, Place } from '@/lib/types';
import {
  Store,
  Tag,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [recentDiscounts, setRecentDiscounts] = useState<Discount[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const m = repository.getOperationalMetrics();
    setMetrics(m);
    setRecentDiscounts(repository.getDiscounts({}).slice(0, 5));
    setRecentPlaces(repository.getPlaces().slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FAF9F6] text-[#15151A]">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E7EC] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                Olato Operational Control
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs text-[#6F7078]">Manual Verification &amp; Data Pipeline</span>
            </div>
            <h1 className="text-3xl font-black text-[#15151A] tracking-tight">Admin Overview</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/discounts"
              className="px-4 py-2.5 bg-[#5B5CE2] hover:bg-[#4B4CCB] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              + Add Discount
            </Link>
            <Link
              href="/admin/places"
              className="px-4 py-2.5 bg-white border border-[#E7E7EC] hover:bg-[#F4F3F0] text-[#15151A] rounded-xl text-xs font-bold transition-all"
            >
              + Add Place
            </Link>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Active Deals</span>
                <div className="p-2.5 bg-[#EEF0FF] text-[#5B5CE2] rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#15151A]">{metrics.totalActiveDiscounts}</div>
              <p className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live on discovery engine
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Partner Places</span>
                <div className="p-2.5 bg-emerald-50 text-[#10B981] rounded-xl">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#15151A]">{metrics.totalPlaces}</div>
              <p className="text-[11px] text-[#6F7078]">
                {metrics.featuredPlacesCount} designated as selected places
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Expiring Soon</span>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#15151A]">{metrics.expiringSoonCount}</div>
              <p className="text-[11px] text-amber-600 font-semibold">Requires end-date renewal check</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Health Rating</span>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#15151A]">{metrics.verificationHealthRate}%</div>
              <p className="text-[11px] text-[#6F7078]">Average verification confidence</p>
            </div>
          </div>
        )}

        {/* Recent Places & Discounts Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Discounts */}
          <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#15151A] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#5B5CE2]" />
                <span>Recent Discounts</span>
              </h3>
              <Link href="/admin/discounts" className="text-xs font-bold text-[#5B5CE2] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentDiscounts.map((d) => (
                <div key={d.id} className="p-3.5 bg-[#FAF9F6] border border-[#E7E7EC] rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#5B5CE2] uppercase tracking-wider block">
                      {d.placeName}
                    </span>
                    <h4 className="text-xs font-bold text-[#15151A] truncate">{d.offerTitle}</h4>
                    <span className="text-[10px] text-[#6F7078]">{d.discountDetails} • {d.bankCard || 'All'}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold block mb-1">
                      {d.confidence}% Conf.
                    </span>
                    <span className="text-[10px] text-[#6F7078]">{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Places */}
          <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#15151A] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#10B981]" />
                <span>Managed Places</span>
              </h3>
              <Link href="/admin/places" className="text-xs font-bold text-[#5B5CE2] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentPlaces.map((p) => (
                <div key={p.id} className="p-3.5 bg-[#FAF9F6] border border-[#E7E7EC] rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
                        {p.category}
                      </span>
                      {p.isFeatured && (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-[#15151A] truncate">{p.name}</h4>
                    <span className="text-[10px] text-[#6F7078]">{p.address}, {p.area}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E7E7EC] text-[10px] font-bold text-[#15151A]">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
