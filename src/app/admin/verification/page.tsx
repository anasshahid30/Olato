'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { repository } from '@/lib/repository';
import { Discount } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Edit2,
  X,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function AdminVerificationPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Form State
  const [lastVerifiedDate, setLastVerifiedDate] = useState('Today (Admin Audited)');
  const [confidence, setConfidence] = useState(95);
  const [status, setStatus] = useState<Discount['status']>('Active');
  const [verificationNotes, setVerificationNotes] = useState('Confirmed via in-person dining check & current printed menu.');

  const reloadDiscounts = () => {
    setDiscounts(repository.getDiscounts({}));
  };

  useEffect(() => {
    reloadDiscounts();
  }, []);

  const handleOpenVerifyModal = (d: Discount) => {
    setEditingDiscount(d);
    setLastVerifiedDate(`Today (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
    setConfidence(d.confidence);
    setStatus(d.status);
    setVerificationNotes('Confirmed via in-person check & current printed menu.');
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscount) return;

    repository.saveDiscount({
      ...editingDiscount,
      lastVerifiedDate,
      confidence,
      status,
    });

    reloadDiscounts();
    setEditingDiscount(null);
  };

  const handleQuickVerify = (d: Discount) => {
    repository.saveDiscount({
      ...d,
      lastVerifiedDate: 'Just now (Instant Verified)',
      confidence: 98,
      status: 'Active',
    });
    reloadDiscounts();
  };

  const filteredDiscounts = discounts.filter((d) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.placeName.toLowerCase().includes(q) ||
        d.offerTitle.toLowerCase().includes(q) ||
        d.lastVerifiedDate.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-[#FAF9F6] text-[#15151A]">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E7EC] pb-6">
          <div>
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider block mb-1">
              Data Integrity &amp; Quality Control
            </span>
            <h1 className="text-3xl font-black text-[#15151A] tracking-tight">Verification Queue</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>{discounts.filter((d) => d.confidence >= 90).length} High-Confidence Deals</span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center px-3 py-2 bg-white border border-[#E7E7EC] rounded-2xl max-w-md shadow-xs">
          <Search className="w-4 h-4 text-[#6F7078] mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venue or verification note..."
            className="text-xs bg-transparent outline-none w-full text-[#15151A]"
          />
        </div>

        {/* Verification Queue Table */}
        <div className="bg-white border border-[#E7E7EC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E7EC] text-[#6F7078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Place / Deal</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Confidence Score</th>
                  <th className="p-4">Last Verified Date</th>
                  <th className="p-4 text-right">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7EC]">
                {filteredDiscounts.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    <td className="p-4">
                      <div className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">{d.placeName}</div>
                      <div className="text-sm font-bold text-[#15151A]">{d.offerTitle}</div>
                      <span className="text-[10px] text-[#6F7078]">{d.discountDetails}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${d.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[#E7E7EC] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${d.confidence >= 90 ? 'bg-[#10B981]' : d.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${d.confidence}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-[#15151A]">{d.confidence}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#6F7078]">
                      {d.lastVerifiedDate}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickVerify(d)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Instant Verify Now"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>

                        <button
                          onClick={() => handleOpenVerifyModal(d)}
                          className="p-1.5 rounded-lg border border-[#E7E7EC] hover:bg-[#FAF9F6] text-[#15151A] cursor-pointer"
                          title="Full Verification Audit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Edit Modal */}
        {editingDiscount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className="relative w-full max-w-md bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E7EC]">
                <h3 className="text-xl font-bold text-[#15151A]">
                  Audit &amp; Verify Deal
                </h3>
                <button
                  onClick={() => setEditingDiscount(null)}
                  className="p-1.5 rounded-full hover:bg-[#FAF9F6] text-[#6F7078] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E7E7EC] text-xs">
                <span className="font-bold text-[#5B5CE2] block">{editingDiscount.placeName}</span>
                <span className="font-bold text-[#15151A]">{editingDiscount.offerTitle}</span>
              </div>

              <form onSubmit={handleSaveVerification} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">
                    Last Verified Date / Time
                  </label>
                  <input
                    type="text"
                    value={lastVerifiedDate}
                    onChange={(e) => setLastVerifiedDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">
                      Confidence Score
                    </label>
                    <span className="text-xs font-black text-[#10B981]">{confidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className="w-full accent-[#10B981] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">
                    Discount Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Expired">Expired</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">
                    Audit Verification Notes
                  </label>
                  <textarea
                    rows={2}
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs text-[#15151A] outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E7E7EC]">
                  <button
                    type="button"
                    onClick={() => setEditingDiscount(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#E7E7EC] text-xs font-bold text-[#6F7078] hover:bg-[#FAF9F6] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Confirm &amp; Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
