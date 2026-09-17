'use client';

import React, { useState, useEffect } from 'react';
import { repository } from '@/lib/repository';
import { Place } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Sparkles, Check, X } from 'lucide-react';

export default function AdminFeaturedPage() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPlaces(repository.getPlaces('ALL'));
  };

  const toggleFeatured = (place: Place) => {
    repository.savePlace({
      ...place,
      isFeatured: !place.isFeatured,
    });
    refreshData();
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-3xl font-bold text-[#15151A]">Featured Places Curator</h1>
        <p className="text-sm text-[#6F7078] mt-0.5">
          Select and highlight top-tier dining destinations on the Olato consumer homepage showcase
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place.id}
            className={`p-5 rounded-2xl border transition-all bg-white ${
              place.isFeatured
                ? 'border-[#5B5CE2] ring-2 ring-[#5B5CE2]/20 shadow-md'
                : 'border-[#E7E7EC]'
            }`}
          >
            <div className="relative h-40 rounded-xl overflow-hidden mb-4">
              <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
              {place.isFeatured && (
                <span className="absolute top-3 left-3 bg-[#5B5CE2] text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="font-bold text-lg text-[#15151A]">{place.name}</h3>
            <p className="text-xs text-[#6F7078] mb-1">{place.category} • {place.area}</p>
            <p className="text-xs text-[#6F7078] line-clamp-2 mb-4">{place.description}</p>

            <Button
              variant={place.isFeatured ? 'outline' : 'primary'}
              size="sm"
              onClick={() => toggleFeatured(place)}
              className="w-full"
            >
              {place.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
