'use client';

import React, { useState, useEffect } from 'react';
import { repository } from '@/lib/repository';
import { Discount, Place, DiscountStatus } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Plus, Edit2, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Partial<Discount> | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDiscounts(repository.getDiscounts({}));
    setPlaces(repository.getPlaces('ALL'));
  };

  const handleOpenAddModal = () => {
    const firstPlace = places[0];
    setEditingDiscount({
      placeId: firstPlace?.id || '',
      placeName: firstPlace?.name || '',
      category: firstPlace?.category || 'CAFE',
      discountDetails: '25% OFF',
      offerTitle: '',
      description: 'Exclusive deal for Olato members.',
      bankCard: 'All Cards',
      studentEligible: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'Active',
      confidence: 95,
      lastVerifiedDate: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (d: Discount) => {
    setEditingDiscount({ ...d });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscount?.offerTitle || !editingDiscount?.placeId) return;

    repository.saveDiscount(editingDiscount as any);
    refreshData();
    setIsModalOpen(false);
  };

  const handleQuickVerify = (id: string) => {
    repository.verifyDiscount(id, 'Active', 99);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this discount offer?')) {
      repository.deleteDiscount(id);
      refreshData();
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#15151A]">Discounts Management</h1>
          <p className="text-sm text-[#6F7078] mt-0.5">
            Create, edit, verify, and track promotional deals, card partner offers, and student eligibility
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAddModal} icon={<Plus className="w-4 h-4" />}>
          Create New Discount
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E7E7EC] text-xs font-bold text-[#6F7078] uppercase tracking-wider">
                <th className="py-3 px-4">Place</th>
                <th className="py-3 px-4">Discount Badge</th>
                <th className="py-3 px-4">Offer Title</th>
                <th className="py-3 px-4">Bank / Card</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7EC]/60">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-[#F7F7FA]">
                  <td className="py-4 px-4 font-bold text-[#15151A]">{d.placeName}</td>
                  <td className="py-4 px-4 font-extrabold text-[#19B87A]">{d.discountDetails}</td>
                  <td className="py-4 px-4 text-xs text-[#15151A] font-semibold max-w-[200px] truncate">
                    {d.offerTitle}
                  </td>
                  <td className="py-4 px-4 text-xs text-[#6F7078]">{d.bankCard || 'All Cards'}</td>
                  <td className="py-4 px-4">
                    {d.studentEligible ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B5CE2] text-xs font-bold">
                        Eligible
                      </span>
                    ) : (
                      <span className="text-xs text-[#6F7078]">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <VerificationBadge lastVerifiedDate={d.lastVerifiedDate} confidence={d.confidence} showDetail={false} />
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        d.status === 'Active'
                          ? 'bg-[#E8FAF2] text-[#19B87A]'
                          : d.status === 'Pending Verification'
                          ? 'bg-[#FEF3C7] text-[#F59E0B]'
                          : 'bg-[#FFF5F5] text-[#EF4444]'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleQuickVerify(d.id)}
                      className="p-1.5 text-[#19B87A] hover:bg-[#E8FAF2] rounded-lg transition-colors"
                      title="Verify Now"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(d)}
                      className="p-1.5 text-[#5B5CE2] hover:bg-[#EEF0FF] rounded-lg transition-colors"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 text-[#EF4444] hover:bg-[#FFF5F5] rounded-lg transition-colors"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDiscount?.id ? 'Edit Discount Offer' : 'Create New Discount Offer'}
        maxWidth="lg"
      >
        {editingDiscount && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Assign Merchant Place</label>
                <select
                  value={editingDiscount.placeId || ''}
                  onChange={(e) => {
                    const selected = places.find((p) => p.id === e.target.value);
                    setEditingDiscount({
                      ...editingDiscount,
                      placeId: e.target.value,
                      placeName: selected?.name || '',
                      category: selected?.category || 'CAFE',
                    });
                  }}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                >
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Discount Badge Details</label>
                <input
                  type="text"
                  placeholder="e.g. 25% OFF, BOGO, 30% OFF"
                  value={editingDiscount.discountDetails || ''}
                  onChange={(e) => setEditingDiscount({ ...editingDiscount, discountDetails: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Offer Title</label>
              <input
                type="text"
                placeholder="e.g. 25% off selected coffee & handcrafted desserts"
                value={editingDiscount.offerTitle || ''}
                onChange={(e) => setEditingDiscount({ ...editingDiscount, offerTitle: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Description</label>
              <textarea
                rows={2}
                value={editingDiscount.description || ''}
                onChange={(e) => setEditingDiscount({ ...editingDiscount, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Bank / Card Specific</label>
                <input
                  type="text"
                  placeholder="e.g. ABC Bank Visa or All Cards"
                  value={editingDiscount.bankCard || ''}
                  onChange={(e) => setEditingDiscount({ ...editingDiscount, bankCard: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Confidence Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingDiscount.confidence ?? 95}
                  onChange={(e) =>
                    setEditingDiscount({ ...editingDiscount, confidence: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Start Date</label>
                <input
                  type="date"
                  value={editingDiscount.startDate || ''}
                  onChange={(e) => setEditingDiscount({ ...editingDiscount, startDate: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">End Date</label>
                <input
                  type="date"
                  value={editingDiscount.endDate || ''}
                  onChange={(e) => setEditingDiscount({ ...editingDiscount, endDate: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Status</label>
                <select
                  value={editingDiscount.status || 'Active'}
                  onChange={(e) =>
                    setEditingDiscount({ ...editingDiscount, status: e.target.value as DiscountStatus })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                >
                  <option value="Active">Active</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Expired">Expired</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="studentEligible"
                  checked={editingDiscount.studentEligible || false}
                  onChange={(e) => setEditingDiscount({ ...editingDiscount, studentEligible: e.target.checked })}
                  className="w-4 h-4 accent-[#5B5CE2]"
                />
                <label htmlFor="studentEligible" className="text-xs font-bold text-[#15151A]">
                  Student Discount Eligible
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E7EC]">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Discount Offer
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
