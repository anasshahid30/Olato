'use client';

import React, { useState, useEffect } from 'react';
import { repository } from '@/lib/repository';
import { Place, CategoryType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit2, Trash2, MapPin, Store, Check } from 'lucide-react';

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Partial<Place> | null>(null);

  useEffect(() => {
    refreshPlaces();
  }, []);

  const refreshPlaces = () => {
    setPlaces(repository.getPlaces('ALL'));
  };

  const handleOpenAddModal = () => {
    setEditingPlace({
      name: '',
      category: 'CAFE',
      description: '',
      address: '',
      city: 'Lahore',
      area: 'Gulberg',
      latitude: 31.5204,
      longitude: 74.3587,
      phone: '',
      openingHours: '08:00 AM - 11:00 PM',
      status: 'Active',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Place) => {
    setEditingPlace({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace?.name) return;

    repository.savePlace(editingPlace as any);
    refreshPlaces();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this place?')) {
      repository.deletePlace(id);
      refreshPlaces();
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#15151A]">Places Management</h1>
          <p className="text-sm text-[#6F7078] mt-0.5">
            Manage partner merchants, category assignments, and location coordinates
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAddModal} icon={<Plus className="w-4 h-4" />}>
          Add New Place
        </Button>
      </div>

      {/* PLACES TABLE */}
      <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E7E7EC] text-xs font-bold text-[#6F7078] uppercase tracking-wider">
                <th className="py-3 px-4">Place Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Address / Area</th>
                <th className="py-3 px-4">Opening Hours</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7EC]/60">
              {places.map((place) => (
                <tr key={place.id} className="hover:bg-[#F7F7FA]">
                  <td className="py-4 px-4 font-bold text-[#15151A]">
                    <div className="flex items-center gap-3">
                      <img
                        src={place.images[0]}
                        alt={place.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <span>{place.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#EEF0FF] text-[#5B5CE2] text-xs font-bold">
                      {place.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-[#6F7078]">
                    {place.address} ({place.area})
                  </td>
                  <td className="py-4 px-4 text-xs text-[#15151A] font-semibold">{place.openingHours}</td>
                  <td className="py-4 px-4">
                    {place.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#E8FAF2] text-[#19B87A] text-xs font-bold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-[#6F7078]">No</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        place.status === 'Active'
                          ? 'bg-[#E8FAF2] text-[#19B87A]'
                          : 'bg-[#FFF5F5] text-[#EF4444]'
                      }`}
                    >
                      {place.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(place)}
                      className="p-1.5 text-[#5B5CE2] hover:bg-[#EEF0FF] rounded-lg transition-colors"
                      title="Edit Place"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="p-1.5 text-[#EF4444] hover:bg-[#FFF5F5] rounded-lg transition-colors"
                      title="Delete Place"
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
        title={editingPlace?.id ? 'Edit Place' : 'Add New Place'}
        maxWidth="lg"
      >
        {editingPlace && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Place Name</label>
                <input
                  type="text"
                  value={editingPlace.name || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Category Scope</label>
                <select
                  value={editingPlace.category || 'CAFE'}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, category: e.target.value as CategoryType })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                >
                  <option value="CAFE">Café</option>
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="FEATURED_PLACE">Featured Place</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Description</label>
              <textarea
                rows={2}
                value={editingPlace.description || ''}
                onChange={(e) => setEditingPlace({ ...editingPlace, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Address</label>
                <input
                  type="text"
                  value={editingPlace.address || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, address: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Area / Neighborhood</label>
                <input
                  type="text"
                  value={editingPlace.area || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, area: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={editingPlace.latitude || 31.5204}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, latitude: parseFloat(e.target.value) })
                  }
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={editingPlace.longitude || 74.3587}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, longitude: parseFloat(e.target.value) })
                  }
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Opening Hours</label>
                <input
                  type="text"
                  value={editingPlace.openingHours || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, openingHours: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#15151A]">Status</label>
                <select
                  value={editingPlace.status || 'Active'}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, status: e.target.value as any })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E7E7EC] text-sm outline-none focus:border-[#5B5CE2]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={editingPlace.isFeatured || false}
                onChange={(e) => setEditingPlace({ ...editingPlace, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-[#5B5CE2]"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-[#15151A]">
                Feature this place in curated homepage showcase
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E7EC]">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Place
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
