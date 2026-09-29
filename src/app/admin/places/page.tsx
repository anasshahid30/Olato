'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { repository } from '@/lib/repository';
import { Place, CategoryType } from '@/lib/types';
import {
  Store,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  X,
  Coffee,
  UtensilsCrossed,
  Star,
  MapPin,
} from 'lucide-react';

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('CAFE');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Gulberg');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const reloadPlaces = () => {
    setPlaces(repository.getPlaces());
  };

  useEffect(() => {
    reloadPlaces();
  }, []);

  const handleOpenModal = (place?: Place) => {
    if (place) {
      setEditingPlace(place);
      setName(place.name);
      setCategory(place.category);
      setAddress(place.address);
      setArea(place.area);
      setDescription(place.description);
      setIsFeatured(place.isFeatured);
      setStatus(place.status);
    } else {
      setEditingPlace(null);
      setName('');
      setCategory('CAFE');
      setAddress('');
      setArea('Gulberg');
      setDescription('');
      setIsFeatured(false);
      setStatus('Active');
    }
    setIsModalOpen(true);
  };

  const handleSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    repository.savePlace({
      id: editingPlace?.id,
      name,
      category,
      address,
      area,
      city: 'Lahore',
      description,
      isFeatured,
      status,
    });

    reloadPlaces();
    setIsModalOpen(false);
  };

  const handleDeletePlace = (id: string) => {
    if (confirm('Are you sure you want to remove this place?')) {
      repository.deletePlace(id);
      reloadPlaces();
    }
  };

  const filteredPlaces = places.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
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
            <h1 className="text-3xl font-black text-[#15151A] tracking-tight">Places &amp; Venues</h1>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5B5CE2] hover:bg-[#4B4CCB] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Place</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#E7E7EC] p-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {(['ALL', 'CAFE', 'RESTAURANT', 'FEATURED_PLACE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-[#5B5CE2] text-white'
                    : 'text-[#6F7078] hover:bg-[#FAF9F6]'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat === 'CAFE' ? 'Cafés' : cat === 'RESTAURANT' ? 'Restaurants' : 'Selected Places'}
              </button>
            ))}
          </div>

          <div className="flex items-center px-3 py-1.5 bg-[#FAF9F6] border border-[#E7E7EC] rounded-xl w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#6F7078] mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search places..."
              className="text-xs bg-transparent outline-none w-full text-[#15151A]"
            />
          </div>
        </div>

        {/* Places List Table */}
        <div className="bg-white border border-[#E7E7EC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E7EC] text-[#6F7078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Place Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Area / Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Selected</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7EC]">
                {filteredPlaces.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    <td className="p-4 font-bold text-[#15151A]">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-[#FAF9F6]"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#15151A]">{p.name}</div>
                          <span className="text-[11px] text-[#6F7078] font-normal">{p.description.slice(0, 45)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5B5CE2] font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-[#6F7078]">
                      {p.address}, {p.area}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {p.isFeatured ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#9A9BA4]">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="p-1.5 rounded-lg border border-[#E7E7EC] hover:bg-[#FAF9F6] text-[#15151A] cursor-pointer"
                          title="Edit Place"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlace(p.id)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Delete Place"
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

        {/* Add / Edit Place Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className="relative w-full max-w-lg bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E7EC]">
                <h3 className="text-xl font-bold text-[#15151A]">
                  {editingPlace ? 'Edit Place Details' : 'Add New Place'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#FAF9F6] text-[#6F7078] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePlace} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Place Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mocca Coffee"
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none focus:border-[#5B5CE2]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryType)}
                      className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    >
                      <option value="CAFE">Café</option>
                      <option value="RESTAURANT">Restaurant</option>
                      <option value="FEATURED_PLACE">Selected Place</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Area</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Gulberg III"
                      className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 1-Mall Road, Lahore"
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-semibold text-[#15151A] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Short Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of the venue vibe and specialties..."
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs text-[#15151A] outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#15151A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#5B5CE2]"
                    />
                    <span>Designate as Selected / Featured Place</span>
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="p-2 rounded-xl bg-[#FAF9F6] border border-[#E7E7EC] text-xs font-bold"
                  >
                    <option value="Active">Active</option>
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
                    {editingPlace ? 'Save Changes' : 'Create Place'}
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
