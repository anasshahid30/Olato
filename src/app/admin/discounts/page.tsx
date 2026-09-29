'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { repository } from '@/lib/repository';
import { Discount, Place, CategoryType, DiscountStatus } from '@/lib/types';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  X,
  CreditCard,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Form State
  const [placeId, setPlaceId] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [discountDetails, setDiscountDetails] = useState('20% OFF');
  const [description, setDescription] = useState('');
  const [bankCard, setBankCard] = useState('');
  const [studentEligible, setStudentEligible] = useState(false);
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [status, setStatus] = useState<DiscountStatus>('Active');
  const [confidence, setConfidence] = useState(95);

  const reloadData = () => {
    setDiscounts(repository.getDiscounts({}));
    const loadedPlaces = repository.getPlaces();
    setPlaces(loadedPlaces);
    if (loadedPlaces.length > 0 && !placeId) {
      setPlaceId(loadedPlaces[0].id);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleOpenModal = (disc?: Discount) => {
    if (disc) {
      setEditingDiscount(disc);
      setPlaceId(disc.placeId);
      setOfferTitle(disc.offerTitle);
      setDiscountDetails(disc.discountDetails);
      setDescription(disc.description);
      setBankCard(disc.bankCard || '');
      setStudentEligible(disc.studentEligible);
      setStartDate(disc.startDate.slice(0, 10));
      setEndDate(disc.endDate.slice(0, 10));
      setStatus(disc.status);
      setConfidence(disc.confidence);
    } else {
      setEditingDiscount(null);
      setPlaceId(places[0]?.id || '');
      setOfferTitle('');
      setDiscountDetails('20% OFF');
      setDescription('');
      setBankCard('');
      setStudentEligible(false);
      setStartDate(new Date().toISOString().slice(0, 10));
      setEndDate('2026-12-31');
      setStatus('Active');
      setConfidence(95);
    }
    setIsModalOpen(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || !placeId) return;

    const selectedPlace = places.find((p) => p.id === placeId);

    repository.saveDiscount({
      id: editingDiscount?.id,
      placeId,
      placeName: selectedPlace?.name || 'Selected Place',
      category: selectedPlace?.category || 'CAFE',
      offerTitle,
      discountDetails,
      description,
      bankCard: bankCard.trim() || undefined,
      studentEligible,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status,
      confidence,
      lastVerifiedDate: 'Today (Admin Verified)',
      image: selectedPlace?.images?.[0] || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      latitude: selectedPlace?.latitude || 31.5204,
      longitude: selectedPlace?.longitude || 74.3587,
    });

    reloadData();
    setIsModalOpen(false);
  };

  const handleDeleteDiscount = (id: string) => {
    if (confirm('Are you sure you want to remove this discount?')) {
      repository.deleteDiscount(id);
      reloadData();
    }
  };

  const filteredDiscounts = discounts.filter((d) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.placeName.toLowerCase().includes(q) ||
        d.offerTitle.toLowerCase().includes(q) ||
        d.discountDetails.toLowerCase().includes(q)
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
            <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider block mb-1">
              Admin Data Management
            </span>
            <h1 className="text-3xl font-black text-[#15151A] tracking-tight">Discounts &amp; Offers</h1>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5B5CE2] hover:bg-[#4B4CCB] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Discount</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center px-3 py-2 bg-white border border-[#E7E7EC] rounded-2xl max-w-md shadow-xs">
          <Search className="w-4 h-4 text-[#6F7078] mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deals, cards or places..."
            className="text-xs bg-transparent outline-none w-full text-[#15151A]"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E7E7EC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E7EC] text-[#6F7078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Place &amp; Title</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Card / Student</th>
                  <th className="p-4">Valid Window</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7EC]">
                {filteredDiscounts.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    <td className="p-4">
                      <div className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">{d.placeName}</div>
                      <div className="text-sm font-bold text-[#15151A]">{d.offerTitle}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-xl bg-[#EEF0FF] text-[#5B5CE2] font-black">
                        {d.discountDetails}
                      </span>
                    </td>
                    <td className="p-4 text-[#6F7078]">
                      {d.bankCard ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#15151A]">
                          <CreditCard className="w-3 h-3 text-[#5B5CE2]" /> {d.bankCard}
                        </span>
                      ) : d.studentEligible ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Student
                        </span>
                      ) : (
                        <span>Open to all</span>
                      )}
                    </td>
                    <td className="p-4 text-[#6F7078]">
                      {d.endDate.slice(0, 10)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                        {d.confidence}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${d.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(d)}
                          className="p-1.5 rounded-lg border border-[#E7E7EC] hover:bg-[#FAF9F6] text-[#15151A] cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className="relative w-full max-w-lg bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E7EC]">
                <h3 className="text-xl font-bold text-[#15151A]">
                  {editingDiscount ? 'Edit Discount Offer' : 'Add New Discount'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#FAF9F6] text-[#6F7078] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDiscount} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Assign to Place</label>
                  <select
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    required
                  >
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category}) - {p.area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Offer Title</label>
                  <input
                    type="text"
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="e.g. 25% Off on All Espresso Drinks"
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Discount Details</label>
                    <input
                      type="text"
                      value={discountDetails}
                      onChange={(e) => setDiscountDetails(e.target.value)}
                      placeholder="e.g. 20% OFF or BOGO"
                      className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Bank / Card</label>
                    <input
                      type="text"
                      value={bankCard}
                      onChange={(e) => setBankCard(e.target.value)}
                      placeholder="e.g. Standard Chartered Visa (or blank)"
                      className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Offer Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how the discount applies..."
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs text-[#15151A] outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#15151A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentEligible}
                      onChange={(e) => setStudentEligible(e.target.checked)}
                      className="w-4 h-4 accent-[#5B5CE2]"
                    />
                    <span>Student Eligible</span>
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="p-2 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending Verification">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E7E7EC]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E7E7EC] text-xs font-bold text-[#6F7078] hover:bg-[#FAF9F6] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#5B5CE2] hover:bg-[#4B4CCB] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {editingDiscount ? 'Save Changes' : 'Create Discount'}
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
