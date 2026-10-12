'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, ChevronDown, Navigation, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function LocationSelector({ className = '' }: { className?: string }) {
  const { activeHub, setHub, requestGPSLocation, isUsingGPS, allHubs } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleGPSClick = async () => {
    setIsLocating(true);
    const success = await requestGPSLocation();
    setIsLocating(false);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Change location, currently ${activeHub.name}`}
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#E7E7EC] text-sm font-semibold text-[#15151A] hover:border-[#5B5CE2]/50 hover:bg-[#F7F7FA] focus-visible:outline-2 focus-visible:outline-[#5B5CE2] transition-all duration-200 select-none ${className}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF]">
          <MapPin className="w-4 h-4 text-[#5B5CE2]" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-[10px] leading-3 font-medium text-[#6F7078]">{isUsingGPS ? activeHub.city || 'Your location' : 'Browsing near'}</span>
          <span suppressHydrationWarning className="block max-w-[105px] sm:max-w-[150px] truncate text-xs sm:text-sm leading-5">{activeHub.name}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#6F7078] shrink-0" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Your Location">
        <div className="space-y-4">
          {/* Browser GPS Action */}
          <p className="text-sm text-[#6F7078]">Choose an area to discover deals nearby.</p>
          {isUsingGPS && <p className="text-xs text-[#6F7078]">GPS location: {activeHub.name}{activeHub.city && `, ${activeHub.city}`}</p>}
          <div className="p-4 bg-[#EEF0FF] rounded-xl border border-[#5B5CE2]/20 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#5B5CE2] text-white rounded-xl">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#15151A]">Use Current GPS Location</h4>
                <p className="text-xs text-[#6F7078]">Detect nearby deals in real time</p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleGPSClick}
              disabled={isLocating}
            >
              {isLocating ? 'Locating...' : 'Enable GPS'}
            </Button>
          </div>

          <div className="text-xs font-bold text-[#6F7078] uppercase tracking-wider px-1">
            Popular Neighborhood Hubs (Lahore)
          </div>

          {/* List of Hubs */}
          <div className="space-y-2">
            {allHubs.map((hub) => {
              const isSelected = !isUsingGPS && activeHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => {
                    setHub(hub);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'bg-[#EEF0FF] border-[#5B5CE2] text-[#5B5CE2] font-bold'
                      : 'bg-white border-[#E7E7EC] hover:bg-[#F7F7FA] text-[#15151A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#5B5CE2]' : 'text-[#6F7078]'}`} />
                    <div>
                      <div className="text-sm font-semibold">{hub.name}</div>
                      <div className="text-xs text-[#6F7078]">{hub.area}, {hub.city}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#5B5CE2]" />}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#6F7078]">Location names by <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap contributors</a>.</p>
        </div>
      </Modal>
    </>
  );
}
