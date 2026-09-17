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
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E7E7EC] text-sm font-semibold text-[#15151A] hover:border-[#5B5CE2]/50 hover:bg-[#F7F7FA] transition-all duration-200 select-none shadow-sm ${className}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="pulse-location absolute inline-flex h-full w-full rounded-full bg-[#19B87A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#19B87A]"></span>
        </span>

        <MapPin className="w-4 h-4 text-[#5B5CE2] shrink-0" />
        <span className="max-w-[130px] sm:max-w-[180px] truncate">{activeHub.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#6F7078] shrink-0" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Your Location">
        <div className="space-y-4">
          {/* Browser GPS Action */}
          <div className="p-4 bg-[#EEF0FF] rounded-xl border border-[#5B5CE2]/20 flex items-center justify-between">
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
        </div>
      </Modal>
    </>
  );
}
